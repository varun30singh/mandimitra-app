import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueueStatus, NotificationEvent, NotificationChannel, ProcurementStatus, PaymentStatus } from '@prisma/client';

export interface TokenStatusDetails {
  token: any;
  centre: any;
  currentServing: any | null;
  nextInLine: any | null;
  queuePosition: number;
  farmersAhead: number;
  estimatedWaitMinutes: number;
  estimatedCallTime: string;
  recommendedDepartureTime: string;
  travelEstimateMinutes: number;
  bufferMinutes: number;
  arrivalStatus: 'DO_NOT_LEAVE_YET' | 'GET_READY' | 'START_TRAVEL' | 'ARRIVED_AT_MANDI' | 'TURN_CALLED' | 'IN_PROCESSING' | 'COMPLETED';
  statusMessage: string;
  subMessage: string;
}

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}

  async getTokenDetails(tokenNumberOrId: string): Promise<TokenStatusDetails> {
    const token = await this.prisma.queueToken.findFirst({
      where: {
        OR: [{ id: tokenNumberOrId }, { tokenNumber: tokenNumberOrId }],
      },
      include: {
        centre: true,
        farmer: true,
        booking: true,
      },
    });

    if (!token) {
      throw new NotFoundException(`Token ${tokenNumberOrId} not found`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current serving token at the centre
    const currentServing = await this.prisma.queueToken.findFirst({
      where: {
        centreId: token.centreId,
        appointmentDate: today,
        status: QueueStatus.PROCESSING,
      },
      orderBy: { sequenceNumber: 'desc' },
    });

    // Get next token called
    const nextInLine = await this.prisma.queueToken.findFirst({
      where: {
        centreId: token.centreId,
        appointmentDate: today,
        status: QueueStatus.CALLED,
      },
      orderBy: { sequenceNumber: 'asc' },
    });

    // Count farmers ahead of this token
    let farmersAhead = 0;
    const activeWaitingStatuses: QueueStatus[] = [QueueStatus.BOOKED, QueueStatus.CHECKED_IN, QueueStatus.WAITING];
    if (activeWaitingStatuses.includes(token.status)) {
      farmersAhead = await this.prisma.queueToken.count({
        where: {
          centreId: token.centreId,
          appointmentDate: today,
          status: { in: [QueueStatus.CHECKED_IN, QueueStatus.WAITING, QueueStatus.CALLED] },
          sequenceNumber: { lt: token.sequenceNumber },
        },
      });
    }

    const effectiveCounters = Math.max(1, token.centre.activeCounters);
    const estimatedWaitMinutes = Math.round((farmersAhead * token.centre.avgProcessingMinutes) / effectiveCounters);

    const now = new Date();
    const estCallDate = new Date(now.getTime() + estimatedWaitMinutes * 60 * 1000);
    const travelTime = token.travelTimeMinutes || 25;
    const bufferTime = 15;
    const depDate = new Date(estCallDate.getTime() - (travelTime + bufferTime) * 60 * 1000);

    const formatTime = (d: Date) =>
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let arrivalStatus: TokenStatusDetails['arrivalStatus'] = 'DO_NOT_LEAVE_YET';
    let statusMessage = "You don't need to leave yet.";
    let subMessage = `Your turn is expected around ${formatTime(estCallDate)}. We'll notify you when to depart.`;

    if (token.status === QueueStatus.COMPLETED) {
      arrivalStatus = 'COMPLETED';
      statusMessage = 'Procurement Completed!';
      subMessage = 'Your produce was inspected and accepted. Check payments tab for DBT status.';
    } else if (token.status === QueueStatus.PROCESSING) {
      arrivalStatus = 'IN_PROCESSING';
      statusMessage = `Currently at Counter ${token.counterNumber || 1}`;
      subMessage = 'Quality assaying and weighing are in progress.';
    } else if (token.status === QueueStatus.CALLED) {
      arrivalStatus = 'TURN_CALLED';
      statusMessage = `Your Turn is Called! Proceed to Counter ${token.counterNumber || 1}`;
      subMessage = 'Please bring your tractor/vehicle to the weighing platform immediately.';
    } else if (token.status === QueueStatus.CHECKED_IN) {
      arrivalStatus = 'ARRIVED_AT_MANDI';
      statusMessage = 'Checked In — Waiting in Yard';
      subMessage = `${farmersAhead} farmers ahead of you. Relax in the farmer waiting shed.`;
    } else if (farmersAhead <= 3) {
      arrivalStatus = 'START_TRAVEL';
      statusMessage = 'Your turn is approaching! Please start travelling.';
      subMessage = `Only ${farmersAhead} farmers ahead of you at ${token.centre.name}.`;
    } else if (farmersAhead <= 6) {
      arrivalStatus = 'GET_READY';
      statusMessage = 'Get ready to leave soon.';
      subMessage = `About ${farmersAhead} farmers ahead. Departure recommended at ${formatTime(depDate)}.`;
    }

    return {
      token,
      centre: token.centre,
      currentServing,
      nextInLine,
      queuePosition: farmersAhead + 1,
      farmersAhead,
      estimatedWaitMinutes,
      estimatedCallTime: formatTime(estCallDate),
      recommendedDepartureTime: formatTime(depDate),
      travelEstimateMinutes: travelTime,
      bufferMinutes: bufferTime,
      arrivalStatus,
      statusMessage,
      subMessage,
    };
  }

  async getLiveQueueForCentre(centreId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const centre = await this.prisma.centre.findUnique({ where: { id: centreId } });
    if (!centre) throw new NotFoundException('Centre not found');

    const [nowServing, nextTokens, waitingTokens, completedCount] = await Promise.all([
      this.prisma.queueToken.findMany({
        where: { centreId, appointmentDate: today, status: QueueStatus.PROCESSING },
        include: { farmer: true },
        orderBy: { counterNumber: 'asc' },
      }),
      this.prisma.queueToken.findMany({
        where: { centreId, appointmentDate: today, status: QueueStatus.CALLED },
        include: { farmer: true },
        orderBy: { sequenceNumber: 'asc' },
      }),
      this.prisma.queueToken.findMany({
        where: {
          centreId,
          appointmentDate: today,
          status: { in: [QueueStatus.CHECKED_IN, QueueStatus.WAITING, QueueStatus.BOOKED] },
        },
        include: { farmer: true },
        orderBy: { sequenceNumber: 'asc' },
        take: 25,
      }),
      this.prisma.queueToken.count({
        where: { centreId, appointmentDate: today, status: QueueStatus.COMPLETED },
      }),
    ]);

    const effectiveCounters = Math.max(1, centre.activeCounters);
    const avgWait = Math.round((waitingTokens.length * centre.avgProcessingMinutes) / effectiveCounters);

    return {
      centre,
      nowServing,
      nextTokens,
      waitingTokens,
      completedCount,
      estimatedWaitMinutes: avgWait,
      totalWaiting: waitingTokens.length,
      activeCounters: centre.activeCounters,
      avgProcessingMinutes: centre.avgProcessingMinutes,
    };
  }

  async getFarmerActiveToken(farmerId: string) {
    const token = await this.prisma.queueToken.findFirst({
      where: {
        farmerId,
        status: { in: [QueueStatus.BOOKED, QueueStatus.CHECKED_IN, QueueStatus.WAITING, QueueStatus.CALLED, QueueStatus.PROCESSING] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!token) return null;
    return this.getTokenDetails(token.id);
  }

  // Operator Action: Call Next Token
  async callNextToken(centreId: string, counterNumber: number = 1, operatorName: string = 'Operator') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find next token that is CHECKED_IN or WAITING
    const nextToken = await this.prisma.queueToken.findFirst({
      where: {
        centreId,
        appointmentDate: today,
        status: { in: [QueueStatus.CHECKED_IN, QueueStatus.WAITING] },
      },
      orderBy: { sequenceNumber: 'asc' },
      include: { farmer: true },
    });

    if (!nextToken) {
      throw new BadRequestException('No farmers currently waiting in the queue for this centre');
    }

    const updatedToken = await this.prisma.queueToken.update({
      where: { id: nextToken.id },
      data: {
        status: QueueStatus.CALLED,
        counterNumber,
        callTime: new Date(),
      },
    });

    // Record event
    await this.prisma.queueEvent.create({
      data: {
        tokenId: nextToken.id,
        previousStatus: nextToken.status,
        newStatus: QueueStatus.CALLED,
        eventType: 'TOKEN_CALLED',
        notes: `Called to Counter ${counterNumber} by ${operatorName}`,
        actorRole: 'OPERATOR',
      },
    });

    // Send high-priority notification to farmer
    await this.prisma.notification.create({
      data: {
        farmerId: nextToken.farmerId,
        title: `Your Turn is Called! (Token ${nextToken.tokenNumber})`,
        message: `Please proceed immediately to Counter ${counterNumber} at ${nextToken.centreId}.`,
        eventType: NotificationEvent.TURN_CALLED,
        channel: NotificationChannel.IN_APP,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actor: operatorName,
        actorRole: 'OPERATOR',
        action: 'CALL_TOKEN',
        entity: 'QueueToken',
        entityId: nextToken.id,
        metadata: { counter: counterNumber, tokenNumber: nextToken.tokenNumber },
      },
    });

    return updatedToken;
  }

  // Operator Action: Mark Farmer as Arrived / Checked In
  async checkInToken(tokenId: string, actorName: string = 'Operator') {
    const token = await this.prisma.queueToken.findUnique({ where: { id: tokenId } });
    if (!token) throw new NotFoundException('Token not found');

    const updated = await this.prisma.queueToken.update({
      where: { id: tokenId },
      data: {
        status: QueueStatus.CHECKED_IN,
        arrivalTime: new Date(),
      },
    });

    await this.prisma.queueEvent.create({
      data: {
        tokenId,
        previousStatus: token.status,
        newStatus: QueueStatus.CHECKED_IN,
        eventType: 'FARMER_CHECKED_IN',
        notes: `Checked in by ${actorName}`,
        actorRole: 'OPERATOR',
      },
    });

    return updated;
  }

  // Operator Action: Start Processing
  async startProcessing(tokenId: string, counterNumber?: number, actorName: string = 'Operator') {
    const token = await this.prisma.queueToken.findUnique({
      where: { id: tokenId },
      include: { booking: true },
    });
    if (!token) throw new NotFoundException('Token not found');

    const updated = await this.prisma.queueToken.update({
      where: { id: tokenId },
      data: {
        status: QueueStatus.PROCESSING,
        counterNumber: counterNumber || token.counterNumber || 1,
        processingStartTime: new Date(),
      },
    });

    await this.prisma.queueEvent.create({
      data: {
        tokenId,
        previousStatus: token.status,
        newStatus: QueueStatus.PROCESSING,
        eventType: 'PROCESSING_STARTED',
        notes: `Procurement processing started at Counter ${counterNumber || 1}`,
        actorRole: 'OPERATOR',
      },
    });

    // Also update or create procurement record to UNDER_PROCESSING
    if (token.bookingId) {
      await this.prisma.procurement.upsert({
        where: { bookingId: token.bookingId },
        update: {
          status: ProcurementStatus.UNDER_PROCESSING,
          processingStart: new Date(),
        },
        create: {
          procurementNumber: `PROC-${Date.now().toString().slice(-8)}`,
          farmerId: token.farmerId,
          centreId: token.centreId,
          bookingId: token.bookingId,
          tokenId: token.id,
          crop: token.booking?.crop || 'Wheat',
          quantity: token.booking?.quantity || 50.0,
          status: ProcurementStatus.UNDER_PROCESSING,
          processingStart: new Date(),
        },
      });
    }

    return updated;
  }

  // Operator Action: Mark Completed
  async completeToken(
    tokenId: string,
    procurementData?: {
      quantity?: number;
      grade?: string;
      moistureContent?: number;
      ratePerQuintal?: number;
    },
    actorName: string = 'Operator',
  ) {
    const token = await this.prisma.queueToken.findUnique({
      where: { id: tokenId },
      include: { booking: true, farmer: true },
    });
    if (!token) throw new NotFoundException('Token not found');

    const updated = await this.prisma.queueToken.update({
      where: { id: tokenId },
      data: {
        status: QueueStatus.COMPLETED,
        processingEndTime: new Date(),
      },
    });

    await this.prisma.queueEvent.create({
      data: {
        tokenId,
        previousStatus: token.status,
        newStatus: QueueStatus.COMPLETED,
        eventType: 'PROCESSING_COMPLETED',
        notes: `Procurement completed and accepted by ${actorName}`,
        actorRole: 'OPERATOR',
      },
    });

    // Create or complete Procurement & Payment records
    const crop = token.booking?.crop || 'Wheat';
    const quantity = procurementData?.quantity || token.booking?.quantity || 50.0;
    const rate = procurementData?.ratePerQuintal || (crop === 'Wheat' ? 2275.0 : 2250.0);
    const totalAmount = parseFloat((quantity * rate).toFixed(2));

    const procurement = await this.prisma.procurement.upsert({
      where: { tokenId: token.id },
      update: {
        status: ProcurementStatus.COMPLETED,
        processingCompletion: new Date(),
        quantity,
        ratePerQuintal: rate,
        totalAmount,
        grade: procurementData?.grade || 'Grade A',
        moistureContent: procurementData?.moistureContent || 11.4,
      },
      create: {
        procurementNumber: `PROC-${Date.now().toString().slice(-8)}`,
        farmerId: token.farmerId,
        centreId: token.centreId,
        bookingId: token.bookingId,
        tokenId: token.id,
        crop,
        quantity,
        grade: procurementData?.grade || 'Grade A',
        moistureContent: procurementData?.moistureContent || 11.4,
        ratePerQuintal: rate,
        totalAmount,
        status: ProcurementStatus.COMPLETED,
        processingCompletion: new Date(),
      },
    });

    // Generate Payment record
    const paymentNumber = `PAY-${Date.now().toString().slice(-8)}`;
    await this.prisma.payment.upsert({
      where: { procurementId: procurement.id },
      update: {
        amount: totalAmount,
        status: PaymentStatus.PROCESSING,
      },
      create: {
        paymentNumber,
        procurementId: procurement.id,
        farmerId: token.farmerId,
        amount: totalAmount,
        status: PaymentStatus.PROCESSING,
        paymentMethod: 'DBT_DIRECT_BENEFIT',
        transactionRef: `DBT${Date.now().toString().slice(-11)}`,
        remarks: 'Direct Benefit Transfer (DBT) to registered Aadhaar-linked Bank Account',
      },
    });

    // Notify farmer
    await this.prisma.notification.create({
      data: {
        farmerId: token.farmerId,
        title: 'Procurement Completed & Payment Processing',
        message: `Your procurement of ${quantity} qtl ${crop} is successfully completed. Expected payout: ₹${totalAmount.toLocaleString('en-IN')}.`,
        eventType: NotificationEvent.PROCUREMENT_COMPLETED,
        channel: NotificationChannel.IN_APP,
      },
    });

    return updated;
  }

  // Operator Action: Skip Token
  async skipToken(tokenId: string, reason: string = 'Farmer not present at counter', actorName: string = 'Operator') {
    const token = await this.prisma.queueToken.findUnique({ where: { id: tokenId } });
    if (!token) throw new NotFoundException('Token not found');

    const updated = await this.prisma.queueToken.update({
      where: { id: tokenId },
      data: { status: QueueStatus.SKIPPED },
    });

    await this.prisma.queueEvent.create({
      data: {
        tokenId,
        previousStatus: token.status,
        newStatus: QueueStatus.SKIPPED,
        eventType: 'TOKEN_SKIPPED',
        notes: `${reason} (recorded by ${actorName})`,
        actorRole: 'OPERATOR',
      },
    });

    return updated;
  }
}
