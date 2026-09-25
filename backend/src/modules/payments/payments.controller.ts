import { Controller, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll() {
    const list = await this.paymentsService.findAll();
    return successResponse(list);
  }

  @Get('farmer/:farmerId')
  async findByFarmer(@Param('farmerId') farmerId: string) {
    const list = await this.paymentsService.findByFarmer(farmerId);
    return successResponse(list);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const payment = await this.paymentsService.findById(id);
    return successResponse(payment);
  }
}
