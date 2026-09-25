import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TimeWindow } from '@prisma/client';

export interface EnrichedSlot {
  id: string;
  centreId: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBookings: number;
  remainingCapacity: number;
  bufferCapacity: number;
  isBlocked: boolean;
  timeWindow: TimeWindow;
  status: 'Available' | 'Limited' | 'Full';
}

@Injectable()
export class SlotsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSlotsForCentre(centreId: string, dateStr?: string): Promise<EnrichedSlot[]> {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    let slots = await this.prisma.slot.findMany({
      where: {
        centreId,
        date: targetDate,
      },
      orderBy: { startTime: 'asc' },
    });

    // If slots do not exist for this date, dynamically generate standard slots
    if (slots.length === 0) {
      slots = await this.generateSlotsForCentre(centreId, targetDate);
    }

    return slots.map((slot) => {
      const remaining = slot.maxCapacity - slot.currentBookings;
      let status: 'Available' | 'Limited' | 'Full' = 'Available';

      if (slot.isBlocked || remaining <= 0) {
        status = 'Full';
      } else if (remaining <= slot.bufferCapacity) {
        status = 'Limited';
      }

      return {
        id: slot.id,
        centreId: slot.centreId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxCapacity: slot.maxCapacity,
        currentBookings: slot.currentBookings,
        remainingCapacity: Math.max(0, remaining),
        bufferCapacity: slot.bufferCapacity,
        isBlocked: slot.isBlocked,
        timeWindow: slot.timeWindow,
        status,
      };
    });
  }

  async generateSlotsForCentre(centreId: string, date: Date) {
    const slotTimes = [
      { start: '08:30', end: '09:00', window: TimeWindow.MORNING },
      { start: '09:00', end: '09:30', window: TimeWindow.MORNING },
      { start: '09:30', end: '10:00', window: TimeWindow.MORNING },
      { start: '10:00', end: '10:30', window: TimeWindow.MORNING },
      { start: '10:30', end: '11:00', window: TimeWindow.MORNING },
      { start: '11:00', end: '11:30', window: TimeWindow.MORNING },
      { start: '11:30', end: '12:00', window: TimeWindow.MORNING },
      { start: '12:00', end: '12:30', window: TimeWindow.AFTERNOON },
      { start: '12:30', end: '13:00', window: TimeWindow.AFTERNOON },
      { start: '13:00', end: '13:30', window: TimeWindow.AFTERNOON },
      { start: '13:30', end: '14:00', window: TimeWindow.AFTERNOON },
      { start: '14:00', end: '14:30', window: TimeWindow.AFTERNOON },
      { start: '14:30', end: '15:00', window: TimeWindow.AFTERNOON },
      { start: '15:00', end: '15:30', window: TimeWindow.AFTERNOON },
      { start: '15:30', end: '16:00', window: TimeWindow.AFTERNOON },
      { start: '16:00', end: '16:30', window: TimeWindow.EVENING },
      { start: '16:30', end: '17:00', window: TimeWindow.EVENING },
    ];

    const createdSlots = [];
    for (const st of slotTimes) {
      const slot = await this.prisma.slot.create({
        data: {
          centreId,
          date,
          startTime: st.start,
          endTime: st.end,
          maxCapacity: 15,
          currentBookings: 0,
          bufferCapacity: 3,
          isBlocked: false,
          timeWindow: st.window,
        },
      });
      createdSlots.push(slot);
    }
    return createdSlots;
  }
}
