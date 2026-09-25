import { Module } from '@nestjs/common';
import { AssistedService } from './assisted.service';
import { AssistedController } from './assisted.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [AssistedController],
  providers: [AssistedService],
  exports: [AssistedService],
})
export class AssistedModule {}
