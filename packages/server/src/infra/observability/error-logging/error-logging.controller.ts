import { Controller, Get, Param } from '@nestjs/common';
import { ErrorLoggingService } from './error-logging.service';

@Controller('error')
export class ErrorLoggingController {
  constructor(private readonly errorLoggingService: ErrorLoggingService) {}

  @Get('/:id')
  async getError(@Param('id') id: string) {
    return this.errorLoggingService.read(id);
  }
}
