import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/', express.static(join(__dirname, '..', 'public')));




  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');

}
bootstrap();