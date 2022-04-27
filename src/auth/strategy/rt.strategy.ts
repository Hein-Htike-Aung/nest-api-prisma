import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
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
  validate(req: Request, payload: JwtPayload): JwtPayload {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
