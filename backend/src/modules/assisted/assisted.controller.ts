import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AssistedService, AssistedBookingDto } from './assisted.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('assisted')
export class AssistedController {
  constructor(private readonly assistedService: AssistedService) {}

  @Post('book')
  async book(@Body() body: AssistedBookingDto) {
    const result = await this.assistedService.bookForFarmer(body);
    return successResponse(result);
  }

  @Get('log')
  async getLog(@Query('operatorId') operatorId?: string) {
    const result = await this.assistedService.getAssistedLog(operatorId);
    return successResponse(result);
  }
}
