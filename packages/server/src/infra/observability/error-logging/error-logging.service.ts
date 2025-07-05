import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorLog } from './schema/error-log.schema';
import { Model } from 'mongoose';

interface ErrorLogDto {
  statusCode: number;
  error: string;
  message: string;
  userId?: string;
  stack?: string;
  request?: string;
}

@Injectable()
export class ErrorLoggingService {
  constructor(
    @InjectModel(ErrorLog.name) private errorLogModel: Model<ErrorLog>,
  ) {}

  create(data: ErrorLogDto) {
    try {
      return this.errorLogModel.create(data);
    } catch (error) {
      Logger.error('Error creating error log:', error);
      throw error;
    }
  }

  read(id: string) {
    try {
      return this.errorLogModel.findById(id);
    } catch (error) {
      Logger.error('Error reading error log:', error);
      throw error;
    }
  }
}
