import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeatherByCoordinates(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('dt') dt: string,
  ) {
    return this.weatherService.fetchAndStoreWeatherData(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(dt)
    );
  }
}
