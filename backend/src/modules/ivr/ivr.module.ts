import { Module } from '@nestjs/common';
import { IvrService } from './ivr.service';
import { IvrController } from './ivr.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [IvrController],
  providers: [IvrService],
  exports: [IvrService],
})
export class IvrModule {}
