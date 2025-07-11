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

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(
    `🚀 HTTP Server is running on: http://localhost:${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );
}

bootstrap().catch((error) => Logger.error('[Bootstrap Error]', error));
