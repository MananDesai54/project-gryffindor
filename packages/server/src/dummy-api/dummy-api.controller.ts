import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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

  @Post('/add-suspect')
  addSuspect(@Body() body: { userId: string; reason: string }) {
    return this.dummyApiService.addSuspectedUser(body);
  }

  @Post('/send-email')
  sendEntityEmail(
    @Body()
    body: {
      subject: string;
      body: string;
      to: string;
    },
  ) {
    return this.dummyApiService.sendEmail(body);
  }

  @Get('/get-city-cabs')
  getCityCabs(
    @Query('city_name')
    city: string,
    @Headers('api_key')
    apiKey: string,
  ) {
    if (apiKey !== '1234') {
      throw new Error('Invalid API Key');
    }
    return this.dummyApiService.getCityCabs(city);
  }
}
