import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { PrismaService } from '../../database/prisma.service';
import { QueueStatus } from '@prisma/client';

describe('QueueService - Business Logic & Calculations', () => {
  let service: QueueService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      queueToken: {
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      queueEvent: {
        create: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      procurement: {
        upsert: jest.fn(),
      },
      payment: {
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Estimated Wait & Departure Calculation', () => {
    it('calculates wait time accurately based on farmers ahead, average processing, and active counters', async () => {
      // Given: 10 farmers ahead, 5 minutes avg processing, 2 active counters
      // Expected wait: (10 * 5) / 2 = 25 minutes
      const mockToken = {
        id: 'tok-123',
        tokenNumber: 'B-042',
        sequenceNumber: 42,
        status: QueueStatus.BOOKED,
        travelTimeMinutes: 20,
        centreId: 'centre-b',
        centre: {
          id: 'centre-b',
          name: 'Mandi Centre B',
          avgProcessingMinutes: 5.0,
          activeCounters: 2,
        },
        farmer: { fullName: 'Ramesh Kumar' },
        booking: { crop: 'Wheat', quantity: 85.0 },
      };

      prismaMock.queueToken.findFirst
        .mockResolvedValueOnce(mockToken) // token details
        .mockResolvedValueOnce(null) // currentServing
        .mockResolvedValueOnce(null); // nextInLine

      prismaMock.queueToken.count.mockResolvedValueOnce(10); // 10 farmers ahead

      const result = await service.getTokenDetails('B-042');

      expect(result.farmersAhead).toBe(10);
      expect(result.estimatedWaitMinutes).toBe(25); // (10 * 5) / 2
      expect(result.arrivalStatus).toBe('DO_NOT_LEAVE_YET');
    });

    it('triggers START_TRAVEL status when farmers ahead is 3 or less', async () => {
      const mockToken = {
        id: 'tok-123',
        tokenNumber: 'B-042',
        sequenceNumber: 42,
        status: QueueStatus.BOOKED,
        travelTimeMinutes: 20,
        centreId: 'centre-b',
        centre: {
          id: 'centre-b',
          name: 'Mandi Centre B',
          avgProcessingMinutes: 6.0,
          activeCounters: 3,
        },
        farmer: { fullName: 'Ramesh Kumar' },
        booking: null,
      };

      prismaMock.queueToken.findFirst.mockResolvedValueOnce(mockToken);
      prismaMock.queueToken.count.mockResolvedValueOnce(3); // 3 farmers ahead

      const result = await service.getTokenDetails('B-042');

      expect(result.farmersAhead).toBe(3);
      expect(result.arrivalStatus).toBe('START_TRAVEL');
      expect(result.statusMessage).toContain('Please start travelling');
    });
  });

  describe('Operator Call Next Token', () => {
    it('transitions next waiting token to CALLED and records audit log', async () => {
      const waitingToken = {
        id: 'tok-next',
        tokenNumber: 'B-036',
        sequenceNumber: 36,
        status: QueueStatus.CHECKED_IN,
        centreId: 'centre-b',
        farmerId: 'farmer-1',
        farmer: { fullName: 'Devidas More' },
      };

      prismaMock.queueToken.findFirst.mockResolvedValueOnce(waitingToken);
      prismaMock.queueToken.update.mockResolvedValueOnce({
        ...waitingToken,
        status: QueueStatus.CALLED,
        counterNumber: 2,
      });

      const called = await service.callNextToken('centre-b', 2, 'Suresh Gaikwad');

      expect(called.status).toBe(QueueStatus.CALLED);
      expect(called.counterNumber).toBe(2);
      expect(prismaMock.queueEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            newStatus: QueueStatus.CALLED,
            eventType: 'TOKEN_CALLED',
          }),
        }),
      );
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'CALL_TOKEN',
            actorRole: 'OPERATOR',
          }),
        }),
      );
    });
  });
});
