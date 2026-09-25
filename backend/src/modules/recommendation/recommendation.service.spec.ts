import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { PrismaService } from '../../database/prisma.service';
import { CentresService } from '../centres/centres.service';
import { CentreStatus } from '@prisma/client';

describe('RecommendationService - Smart Scoring & Explainability', () => {
  let service: RecommendationService;
  let centresServiceMock: any;
  let prismaMock: any;

  beforeEach(async () => {
    centresServiceMock = {
      findAll: jest.fn(),
    };
    prismaMock = {
      farmer: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        { provide: CentresService, useValue: centresServiceMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('recommends the centre with optimal wait & capacity over a closer congested centre', async () => {
    // Centre A: Close (2.0 km), but crowded (queue 25, 45 min wait, 85% capacity)
    // Centre B: Slightly further (4.0 km), but clear (queue 6, 15 min wait, 45% capacity)
    centresServiceMock.findAll.mockResolvedValueOnce([
      {
        id: 'centre-a',
        name: 'Mandi Centre A',
        distanceKm: 2.0,
        currentQueue: 25,
        estimatedWaitMinutes: 45,
        processingSpeed: 8.0,
        capacityUtilization: 85,
        availableSlots: 2,
        status: CentreStatus.ACTIVE,
      },
      {
        id: 'centre-b',
        name: 'Mandi Centre B',
        distanceKm: 4.0,
        currentQueue: 6,
        estimatedWaitMinutes: 15,
        processingSpeed: 6.5,
        capacityUtilization: 45,
        availableSlots: 10,
        status: CentreStatus.ACTIVE,
      },
    ]);

    const results = await service.getRecommendations();

    expect(results.length).toBe(2);
    // Centre B should have a higher score because of much lower queue, higher slots, and lower capacity utilization
    expect(results[0].centre.id).toBe('centre-b');
    expect(results[0].isTopRecommendation).toBe(true);

    // Explainability check
    expect(results[0].reasons.length).toBeGreaterThanOrEqual(3);
    expect(results[0].summaryExplainability).toContain('Recommended because it combines low wait time');
  });

  it('penalizes OVERLOADED centres heavily so farmers are redirected', async () => {
    centresServiceMock.findAll.mockResolvedValueOnce([
      {
        id: 'centre-d',
        name: 'Mandi Centre D',
        distanceKm: 1.5,
        currentQueue: 35,
        estimatedWaitMinutes: 80,
        processingSpeed: 10.0,
        capacityUtilization: 98,
        availableSlots: 0,
        status: CentreStatus.OVERLOADED,
      },
      {
        id: 'centre-c',
        name: 'Mandi Centre C',
        distanceKm: 6.0,
        currentQueue: 8,
        estimatedWaitMinutes: 14,
        processingSpeed: 7.0,
        capacityUtilization: 50,
        availableSlots: 12,
        status: CentreStatus.ACTIVE,
      },
    ]);

    const results = await service.getRecommendations();

    expect(results[0].centre.id).toBe('centre-c');
    expect(results[1].centre.id).toBe('centre-d');
  });
});
