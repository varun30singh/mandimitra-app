import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll(@Query('includeResolved') includeResolved?: string) {
    const alerts = await this.alertsService.findAll(includeResolved === 'true');
    return successResponse(alerts);
  }

  @Post(':id/resolve')
  async resolve(@Param('id') id: string) {
    const updated = await this.alertsService.resolveAlert(id);
    return successResponse(updated);
  }
}
