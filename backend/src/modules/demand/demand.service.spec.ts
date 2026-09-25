import { Test, TestingModule } from '@nestjs/testing';
import { DemandService } from './demand.service';
import { PrismaService } from '../../database/prisma.service';
import { DemandLevel, QueueStatus } from '@prisma/client';

describe('DemandService - Deterministic Demand Intelligence', () => {
  let service: DemandService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      centre: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      queueToken: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DemandService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<DemandService>(DemandService);
  });

  it('detects bottleneck and recommends counter increase when queue pressure is critical', async () => {
    prismaMock.centre.findUnique.mockResolvedValueOnce({
      id: 'centre-d',
      name: 'Mandi Centre D',
      capacity: 50,
      activeCounters: 2,
      avgProcessingMinutes: 10.0,
    });

    // 45 active tokens on capacity of 50 -> 90% utilization
    prismaMock.queueToken.count
      .mockResolvedValueOnce(45) // active
      .mockResolvedValueOnce(20) // booked
      .mockResolvedValueOnce(15); // completed

    const analysis = await service.getCentreDemand('centre-d');

    expect(analysis.currentDemand).toBe(DemandLevel.CRITICAL);
    expect(analysis.bottleneckDetected).toBe(true);
    expect(analysis.recommendedAction).toContain('Open reserve counter');
    expect(analysis.temporalWindows.length).toBe(6);
  });
});
