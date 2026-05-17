import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,  //  Removes any fields that are not in the DTO
      forbidNonWhitelisted: true, //  Throws error if extra fields are sent
      transform: true, //  Automatically converts incoming data types (e.g., string to number)
    }
  ));
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
