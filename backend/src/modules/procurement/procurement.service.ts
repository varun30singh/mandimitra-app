import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProcurementStatus } from '@prisma/client';

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: ProcurementStatus, centreId?: string) {
    return this.prisma.procurement.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(centreId ? { centreId } : {}),
      },
      include: {
        farmer: true,
        centre: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const proc = await this.prisma.procurement.findUnique({
      where: { id },
      include: {
        farmer: true,
        centre: true,
        payment: true,
        token: true,
        booking: true,
      },
    });

    if (!proc) throw new NotFoundException('Procurement record not found');
    return proc;
  }

  async findByFarmer(farmerId: string) {
    return this.prisma.procurement.findMany({
      where: { farmerId },
      include: {
        centre: true,
        payment: true,
        token: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
