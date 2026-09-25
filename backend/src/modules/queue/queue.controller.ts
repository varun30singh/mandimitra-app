import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { successResponse } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('token/:tokenNumber')
  async getTokenDetails(@Param('tokenNumber') tokenNumber: string) {
    const details = await this.queueService.getTokenDetails(tokenNumber);
    return successResponse(details);
  }

  @Get('live/:centreId')
  async getLiveQueue(@Param('centreId') centreId: string) {
    const liveQueue = await this.queueService.getLiveQueueForCentre(centreId);
    return successResponse(liveQueue);
  }

  @Get('farmer/:farmerId/active')
  async getFarmerActiveToken(@Param('farmerId') farmerId: string) {
    const token = await this.queueService.getFarmerActiveToken(farmerId);
    return successResponse(token);
  }

  // Operator Actions
  @Post('call-next')
  async callNextToken(
    @Body() body: { centreId: string; counterNumber?: number; operatorName?: string },
  ) {
    const result = await this.queueService.callNextToken(
      body.centreId,
      body.counterNumber || 1,
      body.operatorName,
    );
    return successResponse(result);
  }

  @Post(':tokenId/check-in')
  async checkInToken(
    @Param('tokenId') tokenId: string,
    @Body() body: { operatorName?: string },
  ) {
    const result = await this.queueService.checkInToken(tokenId, body.operatorName);
    return successResponse(result);
  }

  @Post(':tokenId/start-processing')
  async startProcessing(
    @Param('tokenId') tokenId: string,
    @Body() body: { counterNumber?: number; operatorName?: string },
  ) {
    const result = await this.queueService.startProcessing(tokenId, body.counterNumber, body.operatorName);
    return successResponse(result);
  }

  @Post(':tokenId/complete')
  async completeToken(
    @Param('tokenId') tokenId: string,
    @Body() body: {
      quantity?: number;
      grade?: string;
      moistureContent?: number;
      ratePerQuintal?: number;
      operatorName?: string;
    },
  ) {
    const result = await this.queueService.completeToken(tokenId, body, body.operatorName);
    return successResponse(result);
  }

  @Post(':tokenId/skip')
  async skipToken(
    @Param('tokenId') tokenId: string,
    @Body() body: { reason?: string; operatorName?: string },
  ) {
    const result = await this.queueService.skipToken(tokenId, body.reason, body.operatorName);
    return successResponse(result);
  }
}
