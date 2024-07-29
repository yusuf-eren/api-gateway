import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerFactory } from './logger.factory';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('API GATEWAY'),
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Api Gateway')
    .setDescription('The Api Gateway')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(
    helmet({
      hidePoweredBy: true,
      xXssProtection: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
