import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { QueueModule } from '../queue/queue.module';
import { RecommendationModule } from '../recommendation/recommendation.module';

@Module({
  imports: [QueueModule, RecommendationModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
