import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorLoggingService } from './error-logging.service';
import { ErrorLog, ErrorLogSchema } from './schema/error-log.schema';
import { ErrorLoggingController } from './error-logging.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ErrorLog.name,
        schema: ErrorLogSchema,
      },
    ]),
  ],
  providers: [ErrorLoggingService],
  exports: [ErrorLoggingService],
  controllers: [ErrorLoggingController],
})
export class ErrorLoggingModule {}
