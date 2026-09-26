import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { PrismaService } from '../../database/prisma.service';
import { QueueService } from '../queue/queue.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { ConfigService } from '@nestjs/config';

describe('ChatbotService - Priority Routing & Multilingual Intent Detection', () => {
  let service: ChatbotService;
  let prismaMock: any;
  let queueMock: any;
  let recMock: any;

  beforeEach(async () => {
    prismaMock = {
      chatMessage: { create: jest.fn() },
      farmer: { findFirst: jest.fn() },
      payment: { findFirst: jest.fn() },
    };
    queueMock = {
      getFarmerActiveToken: jest.fn(),
    };
    recMock = {
      getRecommendations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: QueueService, useValue: queueMock },
        { provide: RecommendationService, useValue: recMock },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
  });

  it('detects language accurately across English, Hindi, and Marathi', () => {
    expect(service.detectLanguage('where is my token')).toBe('en');
    expect(service.detectLanguage('मेरा टोकन कहाँ है?')).toBe('hi');
    expect(service.detectLanguage('mera token kab aayega')).toBe('hi');
    expect(service.detectLanguage('माझा टोकन कुठे आहे?')).toBe('mr');
    expect(service.detectLanguage('mazha token kuthe ahe')).toBe('mr');
  });

  it('routes token status query to live database with source="database"', async () => {
    prismaMock.farmer.findFirst.mockResolvedValueOnce({
      id: 'farmer-1',
      fullName: 'Ramesh Kumar',
    });

    queueMock.getFarmerActiveToken.mockResolvedValueOnce({
      token: { tokenNumber: 'B-042' },
      centre: { name: 'Mandi Centre B' },
      farmersAhead: 6,
      estimatedWaitMinutes: 28,
      estimatedCallTime: '11:42 AM',
      statusMessage: "You don't need to leave yet.",
    });

    const response = await service.processMessage('मेरा टोकन कहाँ है', 'farmer-1');

    expect(response.source).toBe('database');
    expect(response.intent).toBe('TOKEN_STATUS');
    expect(response.language).toBe('hi');
    expect(response.reply).toContain('B-042');
    expect(response.reply).toContain('6 किसान');
    expect(response.reply).toContain('11:42 AM');
  });

  it('routes MSP inquiry to approved agricultural knowledge base with source="knowledge_base"', async () => {
    const response = await service.processMessage('what is the msp rate of wheat');
    expect(response.source).toBe('knowledge_base');
    expect(response.intent).toBe('MSP_RATES');
    expect(response.reply).toContain('Wheat: ₹2,585');
  });
});
