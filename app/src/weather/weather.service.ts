import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly apiUrlTemplate: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHERMAP_API_KEY');
    this.apiUrlTemplate = this.configService.get<string>('OPENWEATHERMAP_API_URL_TEMPLATE');
  }

  @Cron('0 */2 * * *') // Runs every 2 hours
  async handleCron() {
    const allLocations = await this.prisma.weather.findMany();

    await Promise.all(
      allLocations.map((location) => this.updateWeatherData(location)),
    );
  }

  private async updateWeatherData(location: { lat: number; lon: number }) {
    try {
      await this.fetchAndStoreWeatherData(location.lat, location.lon);
    } catch (error) {
      console.error(
        `Failed to update weather for lat: ${location.lat}, lon: ${location.lon}`,
        error,
      );
    }
  }

  async fetchAndStoreWeatherData(
    lat: number,
    lon: number,
    dt: number,
  ): Promise<any> {
    //const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    const url = `${this.apiUrlTemplate}lat=${lat}&lon=${lon}&dt=${dt}&appid=${this.apiKey}`;

    try {
      const response = await this.httpService.get(url).toPromise();
      const data = response.data;

      return data;
    } catch (error) {
      console.error(
        `Failed to fetch or store weather data for lat: ${lat}, lon: ${lon}, dt: ${dt}`,
        error,
      );
      throw error;
    }
  }

  private mapWeatherData(data: any) {
    return {
      lon: data.coord.lon,
      lat: data.coord.lat,
      weatherId: data.weather[0].id,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      base: data.base,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      sea_level: data.main.sea_level || 0,
      grnd_level: data.main.grnd_level || 0,
      visibility: data.visibility,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      wind_gust: data.wind.gust || 0,
      rain_1h: data.rain ? data.rain['1h'] : 0,
      clouds_all: data.clouds.all,
      dt: data.dt,
      sys_type: data.sys.type,
      sys_id: data.sys.id,
      country: data.sys.country,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      city_id: data.id,
      city_name: data.name,
      cod: data.cod,
    };
  }
}
