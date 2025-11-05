import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from 'src/common/decorators/public.decorator';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() singupdto: SignupDto) {
    return this.authService.createUser(singupdto);
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    console.log(refreshToken);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { accessToken };
  }

  /* @Public()
  @Post('refresh')
  async refresh(@Req() request: Request, @Body() { token }: RefreshDto) {
    console.log('cookies : ', request.cookies.refreshToken);
    return this.authService.refreshToken(token);
  }*/

  @Public()
  @Get('refresh')
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    console.log('refresh token :', request.cookies.refreshToken);
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(+req.user.userId);
  }
}
