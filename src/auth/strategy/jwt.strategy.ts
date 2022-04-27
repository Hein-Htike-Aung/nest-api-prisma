import { PrismaService } from './../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-token') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

    /* 
  {
  'payload:' {
    sub: 'b02a3cb4-3bbb-4094-906f-6b57dd817109',
    email: 'admin@gmail.com',
    iat: 1650464190,
    exp: 1650465090
  }
}
  */
  // user will be put in request through validate method (available the whole life span)
  async validate(payload: { email: string; password: string }) {
    const storedUser = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        bookmarks: true,
      },
    });

    delete storedUser.password;

    return storedUser;
  }
}
