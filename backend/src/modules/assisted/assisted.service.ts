import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BookingsService } from '../bookings/bookings.service';
import { AuditService } from '../audit/audit.service';

export interface AssistedBookingDto {
  operatorId: string;
  assistedBy: string; // e.g. "CSC Pimpalgaon #4" or "Gram Panchayat Baramati"
  farmerMobile: string;
  farmerName?: string;
  village?: string;
  centreId: string;
  slotId: string;
  crop: string;
  quantity: number;
}

@Injectable()
export class AssistedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsService: BookingsService,
    private readonly auditService: AuditService,
  ) {}

  async bookForFarmer(dto: AssistedBookingDto) {
    // 1. Look up or auto-register farmer
    let user = await this.prisma.user.findUnique({
      where: { mobile: dto.farmerMobile },
      include: { farmer: true },
    });

    if (!user || !user.farmer) {
      const generatedFarmerId = `MH-NAS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      user = await this.prisma.user.create({
        data: {
          mobile: dto.farmerMobile,
          role: 'FARMER',
          farmer: {
            create: {
              farmerId: generatedFarmerId,
              fullName: dto.farmerName || 'Rural Farmer',
              mobile: dto.farmerMobile,
              village: dto.village || 'Pimpalgaon Rural',
              taluka: 'Niphad',
              district: 'Nashik',
              state: 'Maharashtra',
              preferredLanguage: 'hi',
              defaultCrop: dto.crop,
              defaultQuantity: dto.quantity,
              registrationStatus: 'CSC_ASSISTED_VERIFIED',
            },
          },
        },
        include: { farmer: true },
      });
    }

    // 2. Delegate to bookings service
    const bookingResult = await this.bookingsService.createBooking({
      farmerId: user.farmer!.id,
      centreId: dto.centreId,
      slotId: dto.slotId,
      crop: dto.crop,
      quantity: dto.quantity,
      isAssisted: true,
      assistedBy: `${dto.assistedBy} (Op ID: ${dto.operatorId})`,
    });

    // 3. Record assisted audit
    await this.auditService.record(
      dto.assistedBy,
      'CSC_OPERATOR',
      'ASSISTED_BOOKING_CREATED',
      'Booking',
      bookingResult.booking.id,
      {
        farmerMobile: dto.farmerMobile,
        farmerName: user.farmer!.fullName,
        token: bookingResult.token.tokenNumber,
        centre: bookingResult.centre.name,
        timestamp: new Date(),
      },
    );

    return {
      ...bookingResult,
      assistedMeta: {
        assistedBy: dto.assistedBy,
        operatorId: dto.operatorId,
        bookedAt: new Date().toISOString(),
        printableSlipNumber: `SLIP-${bookingResult.token.tokenNumber}`,
      },
    };
  }

  async getAssistedLog(operatorId?: string) {
    return this.prisma.booking.findMany({
      where: {
        isAssisted: true,
      },
      include: {
        farmer: true,
        centre: true,
        token: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
