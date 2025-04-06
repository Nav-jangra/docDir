import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { writeFileSync } from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { value } from './config/value';
import { FilesModule } from './files/files.module';
import { ContextMiddleware } from './middlewares/context.middleware';
import { databaseProvider } from './settings/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => value],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseProvider,
      inject: [ConfigService],
    }),
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    process.env.NODE_CONFIG_RUNTIME_JSON = 'default.js';
    const jsonData = JSON.stringify(value);
    const filePath = 'src/config/default.json';

    try {
      writeFileSync(filePath, jsonData);
      console.log('File Written Successfully')
    }
    catch (err) {
      console.error('Error writing file')
    }
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
