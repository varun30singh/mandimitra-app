import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RecommendationService, RecommendationWeights } from './recommendation.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('farmer/:farmerId')
  async getForFarmer(
    @Param('farmerId') farmerId: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ) {
    const parsedLat = lat ? parseFloat(lat) : undefined;
    const parsedLng = lng ? parseFloat(lng) : undefined;
    const results = await this.recommendationService.getRecommendations(farmerId, parsedLat, parsedLng);
    return successResponse(results);
  }

  @Post('calculate')
  async calculateRecommendations(
    @Body()
    body: {
      lat?: number;
      lng?: number;
      weights?: Partial<RecommendationWeights>;
    },
  ) {
    const results = await this.recommendationService.getRecommendations(
      undefined,
      body.lat,
      body.lng,
      body.weights,
    );
    return successResponse(results);
  }
}
