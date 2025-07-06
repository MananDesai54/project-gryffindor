import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyApiService {
  getWeather() {
    return {
      Mumbai:
        'Weather is Cloudy and Humid. Temperature is 28°C. Humidity is 75%. Excessive rainfall is expected.',
      'New York':
        'Weather is sunny and warm. Temperature is 30°C. Humidity is 60%. No rainfall expected.',
      London:
        'Weather is rainy and cool. Temperature is 15°C. Humidity is 80%. Light rainfall is expected.',
      Paris:
        'Weather is sunny and warm. Temperature is 25°C. Humidity is 65%. No rainfall expected.',
      Tokyo:
        'Weather is sunny and warm. Temperature is 25°C. Humidity is 65%. No rainfall expected.',
      Delhi:
        'Weather is sunny and warm. Temperature is 37°C. Humidity is 65%. No rainfall expected.',
      City_Not_Available: 'Weather information not available',
    };
  }
}
