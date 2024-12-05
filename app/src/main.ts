import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ErrorLoggingFilter } from './error-logging/error-logging.filter';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalFilters(new ErrorLoggingFilter());

  app.use((req: Request, res: Response, next: NextFunction) => {
    const loggerMiddleware = new LoggerMiddleware();
    loggerMiddleware.use(req, res, next);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
