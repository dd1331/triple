import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = exception.getResponse() as {
      message: string;
      error?: string;
      statusCode?: number;
      code?: string;
    };
    console.log(
      '🚀 ~ file: http-exception.filter.ts:12 ~ HttpExceptionFilter ~ exception:',
      host.switchToHttp().getRequest<Request>().url,
      exception,
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(HttpStatus.OK).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: res.code,
      message: res.message,
    });
  }
}
