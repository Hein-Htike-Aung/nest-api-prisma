import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  // user will be put in request through validate method (available only one request)
  async validate(email: string, password: string) {
    const user = await this.authService.checkCredential({ email, password });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
