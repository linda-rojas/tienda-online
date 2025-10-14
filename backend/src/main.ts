import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS para el frontend que está en http://localhost:3001
  app.enableCors({
    origin: 'http://localhost:3001', // Permitir solicitudes desde tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept, Authorization', // Cabeceras permitidas
  });

  app.useGlobalPipes(new ValidationPipe({
    // hace que se cumpla lo que esta en el dto
    whitelist: true,
    transform: true,
  }))
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}
bootstrap();
