import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CentresService } from '../centres/centres.service';
import { CentreStatus } from '@prisma/client';

export interface RecommendationWeights {
  distance: number;
  queue: number;
  speed: number;
  capacity: number;
  slotAvailability: number;
}

export interface RecommendationReason {
  en: string;
  hi: string;
  mr: string;
}

export interface CentreRecommendationResult {
  centre: any;
  recommendationScore: number;
  isTopRecommendation: boolean;
  scoreBreakdown: {
    distanceScore: number;
    queueScore: number;
    speedScore: number;
    capacityScore: number;
    slotScore: number;
  };
  metrics: {
    distanceKm: number;
    queueLength: number;
    estimatedWaitMinutes: number;
    processingMinutesPerFarmer: number;
    capacityUtilization: number;
    availableSlotsCount: number;
    nextAvailableSlot: string;
  };
  reasons: RecommendationReason[];
  summaryExplainability: string;
}

@Injectable()
export class RecommendationService {
  // Default configurable weights summing to 1.0
  private defaultWeights: RecommendationWeights = {
    distance: 0.20,
    queue: 0.25,
    speed: 0.15,
    capacity: 0.20,
    slotAvailability: 0.20,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly centresService: CentresService,
  ) {}

  async getRecommendations(
    farmerId?: string,
    customLat?: number,
    customLng?: number,
    customWeights?: Partial<RecommendationWeights>,
  ): Promise<CentreRecommendationResult[]> {
    let lat = customLat ?? 20.1700; // Default Pimpalgaon / Niphad
    let lng = customLng ?? 74.0500;
    let preferredCentreId: string | null = null;
    let farmerName = 'Farmer';

    if (farmerId) {
      const farmer = await this.prisma.farmer.findFirst({
        where: { OR: [{ id: farmerId }, { farmerId }, { mobile: farmerId }] },
      });
      if (farmer) {
        farmerName = farmer.fullName;
        preferredCentreId = farmer.preferredCentreId;
      }
    }

    const weights: RecommendationWeights = {
      ...this.defaultWeights,
      ...(customWeights || {}),
    };

    // Fetch operational status of all centres
    const centres = await this.centresService.findAll(lat, lng);

    if (centres.length === 0) return [];

    const maxDistance = Math.max(...centres.map((c) => c.distanceKm), 25);
    const maxQueue = Math.max(...centres.map((c) => c.currentQueue), 20);
    const maxSlots = Math.max(...centres.map((c) => c.availableSlots), 20);

    const scoredResults: CentreRecommendationResult[] = [];

    for (const c of centres) {
      // 1. Distance Score: closer is better (0 to 100)
      const distanceScore = Math.max(0, 100 - (c.distanceKm / maxDistance) * 100);

      // 2. Queue Score: shorter queue is better (0 to 100)
      const queueScore = Math.max(0, 100 - (c.currentQueue / maxQueue) * 100);

      // 3. Processing Speed Score: lower minutes is faster (0 to 100)
      // Faster (e.g. 6 min) gets higher score than 10 min
      const speedScore = Math.max(0, 100 - ((c.processingSpeed - 5) / 10) * 100);

      // 4. Capacity Score: lower utilization means more headroom (0 to 100)
      const capacityScore = Math.max(0, 100 - c.capacityUtilization);

      // 5. Slot Availability Score: more open slots is better (0 to 100)
      const slotScore = Math.min(100, (c.availableSlots / maxSlots) * 100);

      // Raw weighted sum
      let totalScore =
        distanceScore * weights.distance +
        queueScore * weights.queue +
        speedScore * weights.speed +
        capacityScore * weights.capacity +
        slotScore * weights.slotAvailability;

      // Penalty for overloaded centres
      if (c.status === CentreStatus.OVERLOADED) {
        totalScore *= 0.5; // 50% penalty to redirect farmers
      }

      // Small bonus if preferred centre has good capacity
      if (c.id === preferredCentreId && c.capacityUtilization < 70) {
        totalScore = Math.min(100, totalScore * 1.05);
      }

      totalScore = parseFloat(totalScore.toFixed(1));

      // Generate explainability reasons
      const reasons: RecommendationReason[] = [];

      reasons.push({
        en: `${c.distanceKm} km away from your farm location`,
        hi: `आपके गाँव से केवल ${c.distanceKm} किमी की दूरी पर`,
        mr: `तुमच्या गावापासून फक्त ${c.distanceKm} किमी अंतरावर`,
      });

      if (c.currentQueue <= 10) {
        reasons.push({
          en: `Very short queue: only ${c.currentQueue} farmers waiting`,
          hi: `बहुत छोटी कतार: केवल ${c.currentQueue} किसान प्रतीक्षा में`,
          mr: `अत्यंत लहान रांग: फक्त ${c.currentQueue} शेतकरी प्रतीक्षेत`,
        });
      } else {
        reasons.push({
          en: `Current queue: ${c.currentQueue} farmers waiting`,
          hi: `वर्तमान कतार: ${c.currentQueue} किसान प्रतीक्षा में`,
          mr: `सध्याची रांग: ${c.currentQueue} शेतकरी प्रतीक्षेत`,
        });
      }

      reasons.push({
        en: `Fast turnaround: approx. ${c.estimatedWaitMinutes} minutes estimated wait`,
        hi: `त्वरित सेवा: अनुमानित प्रतीक्षा समय लगभग ${c.estimatedWaitMinutes} मिनट`,
        mr: `जलद काम: अंदाजे प्रतीक्षा वेळ सुमारे ${c.estimatedWaitMinutes} मिनिटे`,
      });

      reasons.push({
        en: `${c.capacityUtilization}% yard capacity (${100 - c.capacityUtilization}% available headroom)`,
        hi: `${c.capacityUtilization}% यार्ड क्षमता उपयोग (${100 - c.capacityUtilization}% खुला स्थान उपलब्ध)`,
        mr: `${c.capacityUtilization}% यार्ड क्षमता वापर (${100 - c.capacityUtilization}% मोकळी जागा उपलब्ध)`,
      });

      reasons.push({
        en: `${c.availableSlots} dynamic appointment slots available today`,
        hi: `आज ${c.availableSlots} अपॉइंटमेंट स्लॉट उपलब्ध`,
        mr: `आज ${c.availableSlots} अपॉइंटमेंट स्लॉट उपलब्ध आहेत`,
      });

      const nextSlot = '12:30 PM';

      scoredResults.push({
        centre: c,
        recommendationScore: totalScore,
        isTopRecommendation: false,
        scoreBreakdown: {
          distanceScore: parseFloat(distanceScore.toFixed(1)),
          queueScore: parseFloat(queueScore.toFixed(1)),
          speedScore: parseFloat(speedScore.toFixed(1)),
          capacityScore: parseFloat(capacityScore.toFixed(1)),
          slotScore: parseFloat(slotScore.toFixed(1)),
        },
        metrics: {
          distanceKm: c.distanceKm,
          queueLength: c.currentQueue,
          estimatedWaitMinutes: c.estimatedWaitMinutes,
          processingMinutesPerFarmer: c.processingSpeed,
          capacityUtilization: c.capacityUtilization,
          availableSlotsCount: c.availableSlots,
          nextAvailableSlot: nextSlot,
        },
        reasons,
        summaryExplainability: `Recommended because it combines low wait time (${c.estimatedWaitMinutes} min), manageable queue (${c.currentQueue} farmers), and plenty of yard capacity (${100 - c.capacityUtilization}% free).`,
      });
    }

    // Sort by recommendation score descending
    scoredResults.sort((a, b) => b.recommendationScore - a.recommendationScore);

    if (scoredResults.length > 0) {
      scoredResults[0].isTopRecommendation = true;
    }

    return scoredResults;
  }
}
