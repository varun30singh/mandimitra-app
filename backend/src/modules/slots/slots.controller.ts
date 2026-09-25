import { Controller, Get, Param, Query } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('centre/:centreId')
  async getSlots(
    @Param('centreId') centreId: string,
    @Query('date') date?: string,
  ) {
    const slots = await this.slotsService.getSlotsForCentre(centreId, date);
    return successResponse(slots);
  }
}
