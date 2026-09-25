import { Controller, Get, Param } from '@nestjs/common';
import { DemandService } from './demand.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('demand')
export class DemandController {
  constructor(private readonly demandService: DemandService) {}

  @Get('summary')
  async getAllSummary() {
    const summary = await this.demandService.getAllCentresDemandSummary();
    return successResponse(summary);
  }

  @Get('centre/:centreId')
  async getCentreDemand(@Param('centreId') centreId: string) {
    const demand = await this.demandService.getCentreDemand(centreId);
    return successResponse(demand);
  }
}
