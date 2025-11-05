import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { hash, compare, genSalt } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { security } from './constants';
import { Token } from './models/token.model';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async createUser(payload: SignupDto): Promise<Token> {
    //check user existance
    const userExists = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (userExists) {
      throw new ConflictException('Email already in use');
    }

    //hash password
    const hashedPassword = await this.hashPassword(payload.password);

    //create user
    const user = await this.prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });
    return this.generateTokens({ userId: user.id });
  }

  async login(payload: LoginDto): Promise<Token> {
    //check user existance
    const userExists = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!userExists) {
      throw new NotFoundException(`No user found for email : ${payload.email}`);
    }

    const passwordValid = await this.validatePassword(
      payload.password,
      userExists.password,
    );
    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({ userId: userExists.id });
  }

  async getProfile(userId: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
        },
      });
      return user;
    } catch (e) {
      throw new NotFoundException('user not found');
    }
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      return this.generateAccessToken({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }

  private validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }
}
