import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        farmer: true,
        procurement: {
          include: { centre: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFarmer(farmerId: string) {
    return this.prisma.payment.findMany({
      where: { farmerId },
      include: {
        procurement: {
          include: { centre: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        farmer: true,
        procurement: {
          include: { centre: true, token: true },
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment record not found');
    return payment;
  }
}
