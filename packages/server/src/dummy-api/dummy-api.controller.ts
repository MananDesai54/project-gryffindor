import { Controller, Get } from '@nestjs/common';
import { DummyApiService } from './dummy-api.service';

@Controller('dummy-api')
export class DummyApiController {
  constructor(private readonly dummyApiService: DummyApiService) {}

  @Get('/weather')
  getWeather() {
    return this.dummyApiService.getWeather();
  }
}
