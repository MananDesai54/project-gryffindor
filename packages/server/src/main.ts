import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ErrorLoggingService } from './infra/observability/error-logging/error-logging.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalFilters(new HttpExceptionFilter(app.get(ErrorLoggingService)));

  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'kafka-consumer',
          brokers: [process.env.KAFKA_BROKER_URL],
          connectionTimeout: 5000,
          requestTimeout: 30000,
          retry: {
            initialRetryTime: 1000,
            retries: 8,
            maxRetryTime: 30000,
          },
        },
        consumer: {
          groupId: 'kafka-consumer',
          sessionTimeout: 60000,
        },
      },
    });

    await app.startAllMicroservices();
  } catch (error) {
    Logger.error('[Microservice connect error]', error);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => Logger.error('[Bootstrap Error]', error));
