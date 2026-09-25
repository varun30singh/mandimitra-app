import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { successResponse } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('farmer/otp/request')
  async requestFarmerOtp(@Body() body: { mobile: string }) {
    const result = await this.authService.requestFarmerOtp(body.mobile);
    return successResponse(result);
  }

  @Post('farmer/otp/verify')
  async verifyFarmerOtp(
    @Body() body: { mobile: string; otp: string; fullName?: string; village?: string },
  ) {
    const result = await this.authService.verifyFarmerOtp(
      body.mobile,
      body.otp,
      body.fullName,
      body.village,
    );
    return successResponse(result);
  }

  @Post('login')
  async loginWithCredentials(@Body() body: { mobile: string; password: string }) {
    const result = await this.authService.loginWithCredentials(body.mobile, body.password);
    return successResponse(result);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('sub') userId: string) {
    const result = await this.authService.getCurrentUser(userId);
    return successResponse(result);
  }
}
