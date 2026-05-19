import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Increase request payload limits to support high-res Base64 image uploads!
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // 2. Enable CORS (Allows your frontend on port 3000 to securely talk to this API!)
  app.enableCors({
    origin: 'http://localhost:3000', // Expressly permit our React client
    credentials: true,
  });

  // 3. Enable Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Removes any fields that are not in the DTO
    forbidNonWhitelisted: true, // Throws error if extra fields are sent
    transform: true,            // Automatically converts incoming data types
  }));
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

