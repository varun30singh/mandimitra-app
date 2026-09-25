import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueueStatus, NotificationEvent, NotificationChannel } from '@prisma/client';

export interface CreateBookingDto {
  farmerId: string;
  centreId: string;
  slotId: string;
  crop: string;
  quantity: number;
  isAssisted?: boolean;
  assistedBy?: string;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(dto: CreateBookingDto) {
    // Execute inside a database transaction to prevent race conditions and overbooking
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch slot with lock
      const slot = await tx.slot.findUnique({
        where: { id: dto.slotId },
        include: { centre: true },
      });

      if (!slot) {
        throw new NotFoundException('Selected procurement slot not found');
      }

      if (slot.isBlocked || slot.currentBookings >= slot.maxCapacity) {
        throw new BadRequestException('This slot is no longer available. Please select another slot.');
      }

      // Check if farmer already has an active booking for this date
      const existing = await tx.booking.findFirst({
        where: {
          farmerId: dto.farmerId,
          date: slot.date,
          status: { in: ['CONFIRMED', 'BOOKED'] },
        },
      });

      if (existing) {
        throw new BadRequestException('You already have an active procurement booking scheduled for today.');
      }

      // 2. Increment slot bookings
      await tx.slot.update({
        where: { id: slot.id },
        data: {
          currentBookings: { increment: 1 },
          isBlocked: slot.currentBookings + 1 >= slot.maxCapacity,
        },
      });

      // 3. Count today's tokens for sequence number
      const today = new Date(slot.date);
      today.setHours(0, 0, 0, 0);

      const tokenCount = await tx.queueToken.count({
        where: { centreId: dto.centreId, appointmentDate: today },
      });
      const sequenceNumber = tokenCount + 1;

      // Extract centre letter prefix, e.g. Mandi Centre B -> "B", Centre A -> "A"
      const prefixMatch = slot.centre.name.match(/Centre\s+([A-Z])/i) || slot.centre.code.match(/([A-Z])/i);
      const prefix = prefixMatch ? prefixMatch[1].toUpperCase() : 'T';
      const tokenNumber = `${prefix}-${sequenceNumber.toString().padStart(3, '0')}`;

      // 4. Create Booking
      const bookingNumber = `BK-${slot.centre.code.split('-')[1] || 'MND'}-${Date.now().toString().slice(-6)}`;
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          farmerId: dto.farmerId,
          centreId: dto.centreId,
          slotId: dto.slotId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          crop: dto.crop,
          quantity: dto.quantity,
          estimatedWaitMinutes: Math.round(sequenceNumber * 3.5),
          status: 'CONFIRMED',
          isAssisted: dto.isAssisted || false,
          assistedBy: dto.assistedBy,
        },
      });

      // 5. Generate QueueToken
      const estServiceTime = new Date(today);
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      estServiceTime.setHours(startHour, startMin + 15, 0, 0);

      const travelTimeMinutes = 25;
      const bufferMinutes = 20;
      const departureTime = new Date(estServiceTime.getTime() - (travelTimeMinutes + bufferMinutes) * 60 * 1000);

      const queueToken = await tx.queueToken.create({
        data: {
          tokenNumber,
          prefix,
          sequenceNumber,
          farmerId: dto.farmerId,
          centreId: dto.centreId,
          bookingId: booking.id,
          queuePosition: sequenceNumber,
          appointmentDate: slot.date,
          appointmentTime: slot.startTime,
          status: QueueStatus.BOOKED,
          travelTimeMinutes,
          estimatedServiceTime: estServiceTime,
          departureRecommendedAt: departureTime,
        },
      });

      // 6. Record QueueEvent
      await tx.queueEvent.create({
        data: {
          tokenId: queueToken.id,
          newStatus: QueueStatus.BOOKED,
          eventType: 'TOKEN_ISSUED',
          notes: `Digital Token ${tokenNumber} generated via MandiMitra slot booking`,
          actorId: dto.farmerId,
          actorRole: 'FARMER',
        },
      });

      // 7. Notification
      await tx.notification.create({
        data: {
          farmerId: dto.farmerId,
          title: `Slot Booked: Token ${tokenNumber}`,
          message: `Your booking for ${dto.crop} at ${slot.centre.name} is confirmed for ${slot.startTime}. Token: ${tokenNumber}.`,
          eventType: NotificationEvent.TOKEN_GENERATED,
          channel: NotificationChannel.IN_APP,
        },
      });

      // 8. Audit Log
      await tx.auditLog.create({
        data: {
          actor: dto.isAssisted ? `Assisted: ${dto.assistedBy}` : 'Farmer Self-Service',
          actorRole: dto.isAssisted ? 'CSC_OPERATOR' : 'FARMER',
          action: 'CREATE_BOOKING',
          entity: 'Booking',
          entityId: booking.id,
          metadata: { tokenNumber, centre: slot.centre.name, crop: dto.crop, quantity: dto.quantity },
        },
      });

      return {
        booking,
        token: queueToken,
        centre: slot.centre,
        slot,
      };
    });
  }

  async cancelBooking(bookingId: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { token: true, slot: true },
      });

      if (!booking) throw new NotFoundException('Booking not found');

      // Update booking
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      // Free slot capacity
      if (booking.slotId) {
        await tx.slot.update({
          where: { id: booking.slotId },
          data: {
            currentBookings: { decrement: 1 },
            isBlocked: false,
          },
        });
      }

      // Cancel token
      if (booking.token) {
        await tx.queueToken.update({
          where: { id: booking.token.id },
          data: { status: QueueStatus.CANCELLED },
        });

        await tx.queueEvent.create({
          data: {
            tokenId: booking.token.id,
            previousStatus: booking.token.status,
            newStatus: QueueStatus.CANCELLED,
            eventType: 'BOOKING_CANCELLED',
            notes: reason || 'Farmer requested cancellation',
            actorRole: 'FARMER',
          },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          actor: booking.farmerId,
          actorRole: 'FARMER',
          action: 'CANCEL_BOOKING',
          entity: 'Booking',
          entityId: bookingId,
          metadata: { reason },
        },
      });

      return updated;
    });
  }

  async getFarmerBookings(farmerId: string) {
    return this.prisma.booking.findMany({
      where: { farmerId },
      include: {
        centre: true,
        slot: true,
        token: true,
        procurement: {
          include: { payment: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        centre: true,
        slot: true,
        token: {
          include: { events: { orderBy: { createdAt: 'desc' } } },
        },
        farmer: true,
        procurement: {
          include: { payment: true },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
