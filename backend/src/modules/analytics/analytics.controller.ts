import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(@Query('centreId') centreId?: string) {
    const data = await this.analyticsService.getDashboardMetrics(centreId);
    return successResponse(data);
  }
}
