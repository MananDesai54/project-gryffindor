import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { DummyApiService } from './dummy-api.service';

@Controller('dummy-api')
export class DummyApiController {
  constructor(private readonly dummyApiService: DummyApiService) {}

  @Get('/weather')
  getWeather() {
    return this.dummyApiService.getWeather();
  }

  @Get('/cricket-schedule')
  getCricketSchedule() {
    return this.dummyApiService.getCricketSchedule();
  }

  @Get('/user-research/get-all')
  getAllUsers() {
    return this.dummyApiService.getAllUsers();
  }

  @Get('/user-research/get-user-by-name/:name')
  getUserByName(@Param('name') name: string) {
    Logger.log(name);
    return this.dummyApiService.getUserByName(name);
  }

  @Get('/user-research/get-user-by-id/:id')
  getUserById(@Param('id') id: string) {
    return this.dummyApiService.getUserById(id);
  }

  @Get('/user-research/get-user-by-dob/:dob')
  getUserByDob(@Param('dob') dob: string) {
    return this.dummyApiService.getUserByDOB(dob);
  }

  @Post('/send-entity-email')
  sendEntityEmail(
    @Body()
    body: {
      name: string;
      threatLevel: string;
      email: string;
      vehicleInfo: string;
      about: string;
      to: string;
    },
  ) {
    return this.dummyApiService.sendEntityEmail(body);
  }
}
