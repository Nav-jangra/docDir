import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule { }
