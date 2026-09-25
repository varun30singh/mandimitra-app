import { Controller, Get, Post, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('farmer/:farmerId')
  async getNotifications(@Param('farmerId') farmerId: string) {
    const list = await this.notificationsService.getFarmerNotifications(farmerId);
    return successResponse(list);
  }

  @Post(':id/read')
  async markRead(@Param('id') id: string) {
    const updated = await this.notificationsService.markAsRead(id);
    return successResponse(updated);
  }
}
