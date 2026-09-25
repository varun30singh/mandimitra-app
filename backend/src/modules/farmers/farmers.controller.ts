import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FarmersService } from './farmers.service';
import { successResponse } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    const results = await this.farmersService.searchFarmers(query);
    return successResponse(results);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    const farmer = await this.farmersService.getProfile(id);
    return successResponse(farmer);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Param('id') id: string, @Body() body: any) {
    const updated = await this.farmersService.updateProfile(id, body);
    return successResponse(updated);
  }
}
