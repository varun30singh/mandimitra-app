import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeResolved: boolean = false) {
    return this.prisma.alert.findMany({
      where: includeResolved ? {} : { isResolved: false },
      include: { centre: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveAlert(id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });
  }

  async createAlert(data: {
    centreId?: string;
    title: string;
    message: string;
    severity?: string;
    alertType?: string;
    suggestedAction?: string;
  }) {
    return this.prisma.alert.create({
      data: {
        centreId: data.centreId,
        title: data.title,
        message: data.message,
        severity: data.severity || 'WARNING',
        alertType: data.alertType || 'QUEUE_THRESHOLD',
        suggestedAction: data.suggestedAction,
      },
    });
  }
}
