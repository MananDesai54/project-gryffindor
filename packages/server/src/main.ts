import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { ErrorLoggingService } from './infra/observability/error-logging/error-logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalFilters(new HttpExceptionFilter(app.get(ErrorLoggingService)));

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [process.env.KAFKA_BROKER_URL],
  //     },
  //     consumer: {
  //       groupId: 'kafka-consumer',
  //     },
  //   },
  // });

  // await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => Logger.error('[Bootstrap Error]', error));
