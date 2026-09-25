import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CentreStatus, QueueStatus } from '@prisma/client';

export interface CentreOperationalMetrics {
  id: string;
  name: string;
  code: string;
  address: string;
  district: string;
  taluka: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  currentQueue: number;
  estimatedWaitMinutes: number;
  processingSpeed: number; // minutes per farmer
  activeCounters: number;
  availableSlots: number;
  capacityUtilization: number; // percentage
  status: CentreStatus;
  waitLevel: 'Low wait' | 'Moderate' | 'Busy' | 'Full';
  supportedCrops: string[];
}

@Injectable()
export class CentresService {
  constructor(private readonly prisma: PrismaService) {}

  // Haversine formula to compute great-circle distance between two points in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  async findAll(farmerLat?: number, farmerLng?: number): Promise<CentreOperationalMetrics[]> {
    const refLat = farmerLat ?? 20.1700; // Pimpalgaon base
    const refLng = farmerLng ?? 74.0500;

    const centres = await this.prisma.centre.findMany({
      orderBy: { name: 'asc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results: CentreOperationalMetrics[] = [];

    for (const centre of centres) {
      // Calculate active queue (checked-in + waiting)
      const waitingCount = await this.prisma.queueToken.count({
        where: {
          centreId: centre.id,
          appointmentDate: today,
          status: { in: [QueueStatus.CHECKED_IN, QueueStatus.WAITING, QueueStatus.CALLED] },
        },
      });

      // Calculate total active today (including processing)
      const activeCount = await this.prisma.queueToken.count({
        where: {
          centreId: centre.id,
          appointmentDate: today,
          status: { in: [QueueStatus.CHECKED_IN, QueueStatus.WAITING, QueueStatus.CALLED, QueueStatus.PROCESSING] },
        },
      });

      // Estimated wait time based on counters and processing speed
      const effectiveCounters = Math.max(1, centre.activeCounters);
      const estWait = Math.round((waitingCount * centre.avgProcessingMinutes) / effectiveCounters);

      // Slots remaining
      const slots = await this.prisma.slot.findMany({
        where: { centreId: centre.id, date: today },
      });
      const availableSlots = slots.reduce((acc, slot) => {
        const remaining = slot.maxCapacity - slot.currentBookings;
        return acc + (remaining > 0 ? remaining : 0);
      }, 0);

      // Utilization
      const utilization = Math.min(100, Math.round((activeCount / Math.max(1, centre.capacity)) * 100));

      // Wait level
      let waitLevel: 'Low wait' | 'Moderate' | 'Busy' | 'Full' = 'Low wait';
      if (centre.status === CentreStatus.OVERLOADED || utilization >= 90) {
        waitLevel = 'Full';
      } else if (estWait > 45 || utilization >= 75) {
        waitLevel = 'Busy';
      } else if (estWait > 20 || utilization >= 50) {
        waitLevel = 'Moderate';
      }

      const distance = this.calculateDistance(refLat, refLng, centre.latitude, centre.longitude);

      results.push({
        id: centre.id,
        name: centre.name,
        code: centre.code,
        address: centre.address,
        district: centre.district,
        taluka: centre.taluka,
        latitude: centre.latitude,
        longitude: centre.longitude,
        distanceKm: distance,
        currentQueue: waitingCount,
        estimatedWaitMinutes: estWait,
        processingSpeed: centre.avgProcessingMinutes,
        activeCounters: centre.activeCounters,
        availableSlots,
        capacityUtilization: utilization,
        status: centre.status,
        waitLevel,
        supportedCrops: centre.supportedCrops,
      });
    }

    // Sort by distance
    return results.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  async findById(id: string) {
    const centre = await this.prisma.centre.findUnique({
      where: { id },
      include: {
        operators: true,
        alerts: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!centre) {
      throw new NotFoundException(`Centre not found with ID ${id}`);
    }

    return centre;
  }

  async getDigitalTwin(id: string) {
    const centre = await this.findById(id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalToday,
      waiting,
      processing,
      completed,
      skipped,
      called,
    ] = await Promise.all([
      this.prisma.queueToken.count({ where: { centreId: id, appointmentDate: today } }),
      this.prisma.queueToken.count({ where: { centreId: id, appointmentDate: today, status: QueueStatus.WAITING } }),
      this.prisma.queueToken.count({ where: { centreId: id, appointmentDate: today, status: QueueStatus.PROCESSING } }),
      this.prisma.queueToken.count({ where: { centreId: id, appointmentDate: today, status: QueueStatus.COMPLETED } }),
      this.prisma.queueToken.count({ where: { centreId: id, appointmentDate: today, status: { in: [QueueStatus.SKIPPED, QueueStatus.NO_SHOW] } } }),
      this.prisma.queueToken.count({ where: { centreId: id, appointmentDate: today, status: QueueStatus.CALLED } }),
    ]);

    const activeInYard = waiting + processing + called;
    const utilization = Math.min(100, Math.round((activeInYard / Math.max(1, centre.capacity)) * 100));
    const effectiveCounters = Math.max(1, centre.activeCounters);
    const avgWait = Math.round((waiting * centre.avgProcessingMinutes) / effectiveCounters);
    const throughput = parseFloat(((60 / centre.avgProcessingMinutes) * effectiveCounters).toFixed(1)); // farmers/hr

    let demandLevel = 'MODERATE';
    if (utilization > 85) demandLevel = 'CRITICAL';
    else if (utilization > 70) demandLevel = 'HIGH';
    else if (utilization < 40) demandLevel = 'LOW';

    // Fetch active tokens currently being served or called
    const liveCounters = await this.prisma.queueToken.findMany({
      where: {
        centreId: id,
        appointmentDate: today,
        status: { in: [QueueStatus.PROCESSING, QueueStatus.CALLED] },
      },
      include: {
        farmer: { select: { fullName: true, mobile: true, farmerId: true } },
      },
      orderBy: { sequenceNumber: 'asc' },
    });

    return {
      centre: {
        id: centre.id,
        name: centre.name,
        code: centre.code,
        address: centre.address,
        capacity: centre.capacity,
        activeCounters: centre.activeCounters,
        avgProcessingMinutes: centre.avgProcessingMinutes,
        status: centre.status,
      },
      digitalTwin: {
        capacity: centre.capacity,
        currentInYard: activeInYard,
        utilizationPercentage: utilization,
        activeCounters: centre.activeCounters,
        avgProcessingTime: centre.avgProcessingMinutes,
        avgWaitTime: avgWait,
        throughputFarmersPerHour: throughput,
        todayTotalFarmers: totalToday,
        completedCount: completed,
        waitingCount: waiting,
        processingCount: processing,
        calledCount: called,
        skippedCount: skipped,
        demandLevel,
        predictedDemandNextHour: utilization > 75 ? 'HIGH' : 'MODERATE',
        liveCounters,
        recommendedAction:
          utilization > 80
            ? 'Open 1 reserve counter and balance slot distribution'
            : 'Operational state optimal',
      },
    };
  }

  async create(data: any) {
    return this.prisma.centre.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.centre.update({
      where: { id },
      data,
    });
  }
}
