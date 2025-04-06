import { Body, Controller, NotFoundException, Post, Req } from '@nestjs/common';
import { RequestInterface } from 'src/common/interfaces/request.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.login.dto';
import { changePasswordDto } from './dto/auth.password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const serviceResponse = await this.authService.login(body);
    console.info('Service Response' + JSON.stringify(serviceResponse));
    return serviceResponse;
  }

  @Post('/logout')
  async logout(@Body() body: { accessToken: string }) {
    if (!body.accessToken) throw new NotFoundException('No Access Token found');
    await this.authService.logout(body.accessToken);
    console.info('Service Response: true');
    return { message: 'Logout successful' };
  }

  @Post('/change-password')
  async changePassword(@Body() body: changePasswordDto, @Req() request: RequestInterface) {
    const { user } = request.context;
    if (!user) throw new NotFoundException('No user found');
    const serviceResponse = await this.authService.changePassword(body, request.context);
    console.info('Service Response' + JSON.stringify(serviceResponse));
    return { message: 'Password changed successful' };
  }
}
