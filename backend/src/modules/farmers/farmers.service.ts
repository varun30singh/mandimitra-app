import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FarmersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(id: string) {
    const farmer = await this.prisma.farmer.findFirst({
      where: {
        OR: [{ id }, { userId: id }, { farmerId: id }, { mobile: id }],
      },
      include: {
        user: { select: { id: true, mobile: true, role: true } },
        tokens: {
          where: {
            status: { in: ['BOOKED', 'CHECKED_IN', 'WAITING', 'CALLED', 'PROCESSING'] },
          },
          include: {
            centre: true,
            booking: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            centre: true,
            slot: true,
          },
        },
      },
    });

    if (!farmer) {
      throw new NotFoundException(`Farmer not found with identifier: ${id}`);
    }

    return farmer;
  }

  async updateProfile(id: string, data: {
    fullName?: string;
    village?: string;
    taluka?: string;
    district?: string;
    state?: string;
    preferredLanguage?: string;
    defaultCrop?: string;
    defaultQuantity?: number;
    preferredCentreId?: string;
  }) {
    const farmer = await this.prisma.farmer.update({
      where: { id },
      data,
    });
    return farmer;
  }

  async searchFarmers(query: string) {
    if (!query || query.trim().length === 0) {
      return this.prisma.farmer.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    }

    const cleanQuery = query.trim();
    return this.prisma.farmer.findMany({
      where: {
        OR: [
          { mobile: { contains: cleanQuery, mode: 'insensitive' } },
          { farmerId: { contains: cleanQuery, mode: 'insensitive' } },
          { fullName: { contains: cleanQuery, mode: 'insensitive' } },
          { village: { contains: cleanQuery, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }
}
