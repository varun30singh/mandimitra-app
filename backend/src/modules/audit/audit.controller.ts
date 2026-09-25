import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { successResponse } from '../../common/dto/api-response.dto';

@Controller('admin/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getLogs(@Query('limit') limit?: string) {
    const logs = await this.auditService.findAll(limit ? parseInt(limit, 10) : 50);
    return successResponse(logs);
  }
}
