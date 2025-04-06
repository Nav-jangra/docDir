require('dotenv').config();
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MiddlewareExceptionFilter } from './middlewares/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ optionsSuccessStatus: 200 });
  app.useGlobalFilters(new MiddlewareExceptionFilter());
  const port = app.get(ConfigService).get('port');
  await app.listen(port);
  console.log(`Server running on port: ${port}`)
}
bootstrap();
