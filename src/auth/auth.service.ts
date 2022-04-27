import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from './../prisma/prisma.service';
import { UserService } from './../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { CredentialInfo } from './types/credential.type';
import { Tokens } from './types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async signup(authDto: AuthDto) {
    const hashPasword = await argon.hash(authDto.password);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: authDto.email,
          password: hashPasword,
        },
      });

      const tokens = await this.generateToken(newUser.id, newUser.email);

      this.updateRefreshToken(newUser.id, (await tokens).refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential Taken');
        }
      }

      throw error;
    }
  }

  async signin(id: number, email: string) {
    const tokens = this.generateToken(id, email);

    this.updateRefreshToken(id, (await tokens).refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
  }

  async changePassword(userId: number, credentialInfo: CredentialInfo) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const oldPasswordCheck = await argon.verify(
      user.password,
      credentialInfo.oldPassword,
    );

    if (!oldPasswordCheck) {
      throw new ForbiddenException('Incorrect Password');
    }

    const newPasswordCheck = await argon.verify(
      user.password,
      credentialInfo.newPassword,
    );

    if (newPasswordCheck) {
      throw new ForbiddenException(
        'Old Password and new password are the same',
      );
    }

    const hashNewPassword = await argon.hash(credentialInfo.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashNewPassword,
      },
    });

    this.logout(user.id);
  }

  private async updateRefreshToken(id: number, rt: string) {
    const hashRt = await argon.hash(rt);

    await this.prisma.user.update({ where: { id }, data: { hashRt: hashRt } });
  }

  async checkCredential(authDto: AuthDto): Promise<boolean | User> {
    const storedUser = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!storedUser) {
      return false;
    }

    const pwdMatch = await argon.verify(storedUser.password, authDto.password);

    if (!pwdMatch || !storedUser.isApproved) {
      return false;
    }

    return storedUser;
  }

  async refreshToken(id: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || !user.hashRt) {
      throw new UnauthorizedException('there is no logged in user');
    }

    const rtMatch = await argon.verify(user.hashRt, refreshToken);

    if (!rtMatch) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = this.generateToken(id, user.email);

    this.updateRefreshToken(id, (await tokens).refresh_token);

    return tokens;
  }

  async verifyUser(id: number) {
    await this.userService.find_CheckUser(id);

    await this.prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
    return {
      message: 'Successfully Verified User',
    };
  }

  async generateToken(id: number, email: string): Promise<Tokens> {
    const payload = {
      sub: id,
      email,
    };

    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
      await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
