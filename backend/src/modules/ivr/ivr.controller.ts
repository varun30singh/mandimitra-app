import { Controller, Post, Body } from '@nestjs/common';
import { IvrService } from './ivr.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('ivr')
export class IvrController {
  constructor(private readonly ivrService: IvrService) {}

  @Post('call')
  async startCall(@Body() body: { mobile?: string }) {
    const session = await this.ivrService.initiateCall(body.mobile);
    return successResponse(session);
  }

  @Post('dtmf')
  async sendDtmf(@Body() body: { sessionId: string; digit: string }) {
    const session = await this.ivrService.processDtmf(body.sessionId, body.digit);
    return successResponse(session);
  }
}
