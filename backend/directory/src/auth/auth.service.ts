import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { StatusEnum } from 'src/common/constants';
import { ContextInterface } from 'src/common/interfaces/context.interface';
import { CreateSessionDto } from 'src/session/dto/create-session.dto';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/auth.login.dto';
import { changePasswordDto } from './dto/auth.password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private jwtService: JwtService
  ) { }

  private async generateSession(user: User, creds: LoginDto) {
    const defaultSession: CreateSessionDto = {
      expiry: moment().add(this.configService.get<number>('session.duration'), 'd').toDate(),
      user,
      ...(creds?.device && { device: creds?.device }),
    };
    const session = await this.sessionService.create(defaultSession);
    const payload = { id: session.code };
    const jwtToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: `${this.configService.get('jwt.sessionDuration')}`,
    });
    console.info('Jwt Token: ' + jwtToken);
    return jwtToken;
  }

  async login(creds: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: creds.email,
        status: StatusEnum.Active,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
    if (!user) throw new NotFoundException('No user found');
    if (creds.password !== user.password) {
      throw new UnauthorizedException('Incorrect password.');
    }
    const jwtToken = await this.generateSession(user, creds);
    return {
      accessToken: jwtToken,
      user,
    };
  }

  async logout(token: string) {
    const { id } = await this.jwtService.verify(token, { secret: this.configService.get('jwt.secret') });
    await this.sessionService.markSessionInactive(id);
    return true;
  }

  async changePassword(passwords: changePasswordDto, context: ContextInterface) {
    if (passwords?.oldPassword.toLocaleLowerCase().trim() === passwords?.newPassword.toLocaleLowerCase().trim())
      throw new NotAcceptableException('New password should not be same as Old password');

    if (passwords.oldPassword !== context.user?.password)
      throw new BadRequestException('Incorrect current password !!');

    const response = await this.userRepository.update(
      { id: context.user?.id },
      { password: passwords.newPassword }
    );

    console.info('Password changed:\n' + response);
    return true;
  }
}
