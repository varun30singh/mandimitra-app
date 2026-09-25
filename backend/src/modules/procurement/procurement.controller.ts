import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { successResponse } from '../../common/dto/api-response.dto';
import { ProcurementStatus } from '@prisma/client';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get()
  async findAll(
    @Query('status') status?: ProcurementStatus,
    @Query('centreId') centreId?: string,
  ) {
    const list = await this.procurementService.findAll(status, centreId);
    return successResponse(list);
  }

  @Get('farmer/:farmerId')
  async findByFarmer(@Param('farmerId') farmerId: string) {
    const list = await this.procurementService.findByFarmer(farmerId);
    return successResponse(list);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const item = await this.procurementService.findById(id);
    return successResponse(item);
  }
}
