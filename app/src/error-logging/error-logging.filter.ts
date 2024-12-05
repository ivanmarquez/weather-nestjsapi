import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class ErrorLoggingFilter implements ExceptionFilter {
  private readonly logger = new Logger('Error');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal Server Error',
    };

    this.logger.error(
      `Status: ${status} | Error: ${exception.message} | Path: ${request.url}`,
    );

    response.status(status).json(errorResponse);
  }
}
