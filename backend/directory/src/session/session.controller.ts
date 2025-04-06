import { Controller, Get, Param } from '@nestjs/common';
import { SessionService } from './session.service';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Get(':sessionId')
  async fetchOne(
    @Param('sessionId') sessionId: string,
  ) {
    return await this.sessionService.fetchSession(sessionId);
  }
}
