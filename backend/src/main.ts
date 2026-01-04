import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // Sentry error handler
  const { httpAdapter } = app.get(HttpAdapterHost);
  // Sentry.setupNestErrorHandler(app, new Sentry.BaseExceptionFilter(httpAdapter));
  // NOTE: setupNestErrorHandler and BaseExceptionFilter might be deprecated or require a specific Sentry NestJS setup.
  // Using standard global filter if needed, but for now we rely on Sentry.init() which handles uncaught exceptions globally in Node.
  // If a specific NestJS filter is needed, it should be:
  // app.useGlobalFilters(new Sentry.BaseExceptionFilter(httpAdapter));
  // However, BaseExceptionFilter is not exported by @sentry/nestjs in recent versions directly or requires @sentry/node.
  // Given the error, we will remove this explicit call and rely on standard Sentry Node instrumentation and global catch.

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
