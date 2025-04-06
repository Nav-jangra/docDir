import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { value } from '../../config/value';
import { Session } from "./apis/session";
import { HttpHelper } from './helpers/http.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [() => value],
    }),
  ],
  controllers: [],
  providers: [Session, HttpHelper],
  exports: [Session],
})
export class DirectoryClient { }
