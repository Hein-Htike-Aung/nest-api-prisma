import { RtStrategy } from './strategy/rt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [AuthService, JwtStrategy, LocalStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
