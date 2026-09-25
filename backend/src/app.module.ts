import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { FarmersModule } from './modules/farmers/farmers.module';
import { CentresModule } from './modules/centres/centres.module';
import { SlotsModule } from './modules/slots/slots.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { QueueModule } from './modules/queue/queue.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { DemandModule } from './modules/demand/demand.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { IvrModule } from './modules/ivr/ivr.module';
import { AssistedModule } from './modules/assisted/assisted.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    DatabaseModule,
    AuditModule,
    AuthModule,
    FarmersModule,
    CentresModule,
    SlotsModule,
    BookingsModule,
    QueueModule,
    RecommendationModule,
    DemandModule,
    ProcurementModule,
    PaymentsModule,
    AnalyticsModule,
    AlertsModule,
    NotificationsModule,
    ChatbotModule,
    IvrModule,
    AssistedModule,
  ],
})
export class AppModule {}
