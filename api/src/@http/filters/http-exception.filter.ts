import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

interface ErrorResponse {
  status: HttpStatus;
  message: string;
}

type ExceptionHandler = (exception: any) => ErrorResponse;

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  private readonly exceptionHandlers: Record<string, ExceptionHandler> = {
    HttpException: (exception: HttpException): ErrorResponse => ({
      status: exception.getStatus(),
      message: this.extractMessageFromHttpException(exception),
    }),

    QueryFailedError: (): ErrorResponse => ({
      status: HttpStatus.BAD_REQUEST,
      message: 'Database query failed',
    }),

    EntityNotFoundError: (): ErrorResponse => ({
      status: HttpStatus.NOT_FOUND,
      message: 'Entity not found',
    }),

    default: (): ErrorResponse => ({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }),
  };

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.handleException(exception);

    this.logException(request, exception);
    this.sendErrorResponse(response, request, errorResponse);
  }

  private handleException(exception: unknown): ErrorResponse {
    const exceptionType = this.getExceptionType(exception);
    const handler =
      this.exceptionHandlers[exceptionType] || this.exceptionHandlers.default;

    return handler(exception);
  }

  private getExceptionType(exception: unknown): string {
    switch (true) {
      case exception instanceof HttpException:
        return 'HttpException';
      case exception instanceof QueryFailedError:
        return 'QueryFailedError';
      case exception instanceof EntityNotFoundError:
        return 'EntityNotFoundError';
      default:
        return 'default';
    }
  }

  private extractMessageFromHttpException(exception: HttpException): string {
    const errorResponse = exception.getResponse();

    if (typeof errorResponse !== 'object' || !errorResponse) {
      return String(errorResponse);
    }

    if ('message' in errorResponse) {
      const { message } = errorResponse as { message: string | string[] };
      return Array.isArray(message) ? message.join(', ') : String(message);
    }

    return String(errorResponse);
  }

  private logException(request: Request, exception: unknown): void {
    const stack =
      exception instanceof Error ? exception.stack : 'No stack trace';

    this.logger.error(`${request.method} ${request.url}`, stack);
  }

  private sendErrorResponse(
    response: Response,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    response.status(errorResponse.status).json({
      statusCode: errorResponse.status,
      message: errorResponse.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
