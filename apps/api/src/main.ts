import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env['CORS_ORIGIN'] ?? '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
  });

  const port = Number(process.env['PORT'] ?? 3000);
  await app.listen(port);
  console.log(`[MonBilan+ API] Listening on http://localhost:${port}/v1/health`);
}

bootstrap();
