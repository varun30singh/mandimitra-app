import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService, CreateBookingDto } from './bookings.service';
import { successResponse } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() body: CreateBookingDto) {
    const result = await this.bookingsService.createBooking(body);
    return successResponse(result);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    const result = await this.bookingsService.getBookingById(id);
    return successResponse(result);
  }

  @Get('farmer/:farmerId')
  async getFarmerBookings(@Param('farmerId') farmerId: string) {
    const result = await this.bookingsService.getFarmerBookings(farmerId);
    return successResponse(result);
  }

  @Post(':id/cancel')
  async cancelBooking(@Param('id') id: string, @Body() body: { reason?: string }) {
    const result = await this.bookingsService.cancelBooking(id, body.reason);
    return successResponse(result);
  }
}
