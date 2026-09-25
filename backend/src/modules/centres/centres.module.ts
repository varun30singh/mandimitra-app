import { Module } from '@nestjs/common';
import { CentresService } from './centres.service';
import { CentresController } from './centres.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CentresController],
  providers: [CentresService],
  exports: [CentresService],
})
export class CentresModule {}
