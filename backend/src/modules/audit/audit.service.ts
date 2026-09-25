import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    actor: string,
    actorRole: string,
    action: string,
    entity: string,
    entityId?: string,
    metadata?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        actor,
        actorRole,
        action,
        entity,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  }

  async findAll(limit: number = 50) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }
}
