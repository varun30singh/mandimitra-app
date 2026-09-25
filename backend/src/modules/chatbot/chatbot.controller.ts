import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { successResponse } from '../../common/dto/api-response.dto';

export interface ChatDto {
  message: string;
  farmer_id?: string;
  session_id?: string;
}

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  async chat(@Body() body: ChatDto) {
    const result = await this.chatbotService.processMessage(
      body.message,
      body.farmer_id,
      body.session_id,
    );
    return successResponse(result);
  }
}
