import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { writeFileSync } from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './common/constants';
import { value } from './config/value';
import { ContextMiddleware } from './middlewares/context.middleware';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { databaseProvider } from './settings/database';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => value],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiry },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseProvider,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule
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
