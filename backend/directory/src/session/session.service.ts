import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/common/constants';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) { }

  async create(createSessionDto: CreateSessionDto) {
    const sessionRef = this.sessionRepository.create({
      ...createSessionDto,
      code: uuid()
    });
    const session = await this.sessionRepository.save(sessionRef);
    console.info('Session: ' + JSON.stringify(session));
    return session;
  }

  async fetchSession(code: string) {
    let sessions = await this.sessionRepository.find({
      where: {
        code,
        status: StatusEnum.Active,
        expiry: MoreThanOrEqual(new Date())
      },
      relations: {
        user: {
          role: {
            permissions: true
          }
        }
      }
    })

    if (!(sessions.length > 0)) throw new UnauthorizedException('Not a valid session');

    let session = {
      permissions: sessions[0]?.user?.role?.permissions?.map(p => p.name),
      role: sessions[0]?.user.role,
      session: sessions[0],
      user: sessions[0]?.user
    }
    console.info('session:' + JSON.stringify(session) + Object.keys(session).length);
    return session;
  }

  async markSessionInactive(sessionId: string) {
    const value = await this.sessionRepository.update({ code: sessionId, status: StatusEnum.Active }, { status: StatusEnum.Inactive });
    if (!value.affected) {
      console.info(`No active session found ${value.affected}`);
    } else {
      console.info('Session marked Inactive: ' + sessionId);
    }
    return true;
  }
}
