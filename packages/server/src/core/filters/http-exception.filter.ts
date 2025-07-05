import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ErrorLoggingService } from '../../infra/observability/error-logging/error-logging.service';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly errorLogService: ErrorLoggingService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if ((status as HttpStatus) === HttpStatus.UNAUTHORIZED) {
      response.status(status).json({
        message: 'Unauthorized',
      });
      return;
    }

    const userId = request.context?.authContext?.userId;

    this.errorLogService
      .create({
        userId,
        statusCode: status,
        message:
          exception instanceof Error ? exception.message : 'Unknown error',
        stack: exception instanceof Error ? exception.stack : undefined,
        request: JSON.stringify({
          path: request.url,
          method: request.method,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          body: request.body,
          query: request.query,
          params: request.params,
        }),
        error: JSON.stringify(exception),
      })
      .then((err) => {
        response.status(status).json({
          errorId: err._id,
          error: exception,
          message:
            exception instanceof Error ? exception.message : 'Unknown error',
        });
      })
      .catch(console.log);
  }
}
