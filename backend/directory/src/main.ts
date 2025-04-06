require('dotenv').config();
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api/');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Directory Module Api Documentation')
    .setDescription(
      'Welcome to the Directory Module API documentation.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('APPLICATION_PORT');
  await app.listen(port);
  console.log('Server running', configService.get('APPLICATION_PORT'));
}
bootstrap();
