import { HttpModule } from "@nestjs/axios";
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { writeFile } from 'fs';
import { ApiService } from 'src/apis/apis.service';
import { GuardController } from 'src/app.controller';
import { apisController } from './apis/apis.controller';
import { Apis } from './apis/entity/apis.entity';
import { DirectoryClient } from "./clients/directoryClient/module";
import { value } from './config/value';
import { Guard } from './middlewares/guard';
import { databaseProvider } from './settings/database';
import { UtilityModule } from './utilities/module';
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
    TypeOrmModule.forFeature([Apis]),
    DirectoryClient,
    UtilityModule,
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [apisController, GuardController],
  providers: [ApiService],
})
export class AppModule {
  constructor() {
    process.env.NODE_CONFIG_RUNTIME_JSON = 'default.json';
    const jsonData = JSON.stringify(value);
    let filePath = 'src/config/default.json';
    writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file created successfully:', filePath);
      }
    });
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Guard).forRoutes('/api');
  }
}
