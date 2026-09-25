import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DemandLevel, TimeWindow, QueueStatus } from '@prisma/client';

export interface CentreDemandAnalysis {
  centreId: string;
  centreName: string;
  timeWindow: TimeWindow;
  currentDemand: DemandLevel;
  expectedDemand: DemandLevel;
  queuePressure: number; // 0.0 to 1.0
  capacityUtilization: number; // 0.0 to 1.0
  processingThroughput: number; // farmers / hour
  slotPressure: number; // 0.0 to 1.0
  trend: 'RISING' | 'STABLE' | 'FALLING';
  recommendedAction: string;
  bottleneckDetected: boolean;
  temporalWindows: {
    window: string;
    label: string;
    timeRange: string;
    demandLevel: DemandLevel;
    projectedArrivals: number;
  }[];
}

@Injectable()
export class DemandService {
  constructor(private readonly prisma: PrismaService) {}

  async getCentreDemand(centreId: string): Promise<CentreDemandAnalysis> {
    const centre = await this.prisma.centre.findUnique({ where: { id: centreId } });
    if (!centre) throw new Error('Centre not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate active queue and capacity
    const activeTokens = await this.prisma.queueToken.count({
      where: {
        centreId,
        appointmentDate: today,
        status: { in: [QueueStatus.CHECKED_IN, QueueStatus.WAITING, QueueStatus.PROCESSING] },
      },
    });

    const bookedTokens = await this.prisma.queueToken.count({
      where: {
        centreId,
        appointmentDate: today,
        status: QueueStatus.BOOKED,
      },
    });

    const completedTokens = await this.prisma.queueToken.count({
      where: {
        centreId,
        appointmentDate: today,
        status: QueueStatus.COMPLETED,
      },
    });

    const capacityUtil = parseFloat(Math.min(1.0, activeTokens / Math.max(1, centre.capacity)).toFixed(2));
    const queuePressure = parseFloat(Math.min(1.0, (activeTokens * centre.avgProcessingMinutes) / (centre.activeCounters * 60 * 2)).toFixed(2));
    const slotPressure = parseFloat(Math.min(1.0, (activeTokens + bookedTokens) / Math.max(1, centre.capacity)).toFixed(2));
    const throughput = parseFloat(((60 / centre.avgProcessingMinutes) * centre.activeCounters).toFixed(1));

    let currentDemand: DemandLevel = DemandLevel.MODERATE;
    if (queuePressure >= 0.85 || capacityUtil >= 0.85) currentDemand = DemandLevel.CRITICAL;
    else if (queuePressure >= 0.65 || capacityUtil >= 0.65) currentDemand = DemandLevel.HIGH;
    else if (queuePressure <= 0.35) currentDemand = DemandLevel.LOW;

    let expectedDemand = currentDemand;
    if (bookedTokens > 15) {
      expectedDemand = currentDemand === DemandLevel.LOW ? DemandLevel.MODERATE : (currentDemand === DemandLevel.MODERATE ? DemandLevel.HIGH : DemandLevel.CRITICAL);
    }

    let trend: 'RISING' | 'STABLE' | 'FALLING' = 'STABLE';
    if (bookedTokens > 15) trend = 'RISING';
    else if (activeTokens < 5) trend = 'FALLING';

    let recommendedAction = 'Maintain standard counter speed and FIFO queue flow.';
    let bottleneck = false;

    if (currentDemand === DemandLevel.CRITICAL || queuePressure >= 0.8) {
      bottleneck = true;
      recommendedAction = 'CRITICAL: Open reserve counter #5 immediately & redirect new farmer bookings to nearby Mandi Centre B/C.';
    } else if (currentDemand === DemandLevel.HIGH) {
      recommendedAction = 'HIGH DEMAND: Expedite moisture testing and notify upcoming slot farmers of 15-min travel buffers.';
    }

    const temporalWindows = [
      { window: '15_MIN', label: 'Next 15 Minutes', timeRange: 'Current Window', demandLevel: currentDemand, projectedArrivals: Math.round(activeTokens * 0.3) },
      { window: '30_MIN', label: 'Next 30 Minutes', timeRange: 'Short-Term', demandLevel: currentDemand, projectedArrivals: Math.round(activeTokens * 0.6) },
      { window: '60_MIN', label: 'Next 60 Minutes', timeRange: '1 Hour Horizon', demandLevel: expectedDemand, projectedArrivals: activeTokens + Math.round(bookedTokens * 0.4) },
      { window: 'MORNING', label: 'Morning Session', timeRange: '08:00 AM - 12:00 PM', demandLevel: DemandLevel.HIGH, projectedArrivals: Math.max(45, completedTokens + activeTokens) },
      { window: 'AFTERNOON', label: 'Afternoon Session', timeRange: '12:00 PM - 04:00 PM', demandLevel: currentDemand, projectedArrivals: Math.max(35, bookedTokens) },
      { window: 'EVENING', label: 'Evening Session', timeRange: '04:00 PM - 06:00 PM', demandLevel: DemandLevel.MODERATE, projectedArrivals: 18 },
    ];

    return {
      centreId,
      centreName: centre.name,
      timeWindow: TimeWindow.SLOT,
      currentDemand,
      expectedDemand,
      queuePressure,
      capacityUtilization: capacityUtil,
      processingThroughput: throughput,
      slotPressure,
      trend,
      recommendedAction,
      bottleneckDetected: bottleneck,
      temporalWindows,
    };
  }

  async getAllCentresDemandSummary() {
    const centres = await this.prisma.centre.findMany();
    const summaries = [];
    for (const c of centres) {
      const demand = await this.getCentreDemand(c.id);
      summaries.push(demand);
    }
    return summaries;
  }
}
