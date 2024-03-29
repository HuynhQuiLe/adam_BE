import * as dotenv from 'dotenv'

dotenv.config()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  * as express  from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //CORS
  app.enableCors({
    origin: ['*', 'http://localhost:5173'],
  });

  // middelware
  app.use(express.static('.'))

  await app.listen(3000);
}
bootstrap();
