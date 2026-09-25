import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CentresService } from './centres.service';
import { successResponse } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('centres')
export class CentresController {
  constructor(private readonly centresService: CentresService) {}

  @Get()
  async findAll(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    const parsedLat = lat ? parseFloat(lat) : undefined;
    const parsedLng = lng ? parseFloat(lng) : undefined;
    const result = await this.centresService.findAll(parsedLat, parsedLng);
    return successResponse(result);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.centresService.findById(id);
    return successResponse(result);
  }

  @Get(':id/digital-twin')
  async getDigitalTwin(@Param('id') id: string) {
    const result = await this.centresService.getDigitalTwin(id);
    return successResponse(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() body: any) {
    const result = await this.centresService.create(body);
    return successResponse(result);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  async update(@Param('id') id: string, @Body() body: any) {
    const result = await this.centresService.update(id, body);
    return successResponse(result);
  }
}
