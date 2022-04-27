import { JwtPayload } from './types/jwt-payload.type';
import { RtGuard } from './../common/guards/rt.guard';
import { JwtGuard } from './../common/guards/jwt.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedGuard } from './../common/guards/authenticated.guard';
import { LocalAuthGuard } from './../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CredentialInfo } from './types/credential.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @Public()
  @HttpCode(200)
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@CurrentUser() user: User) {
    return this.authService.signin(user.id, user.email);
  }

  @HttpCode(204)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    this.authService.logout(user.id);
  }

  // Access with refresh Token
  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  refreshToken(@CurrentUser() jwtPayload: JwtPayload) {
    return this.authService.refreshToken(
      +jwtPayload.sub,
      jwtPayload.refreshToken,
    );
  }

  @Public()
  @Get('verify/:id')
  verifyUser(@Param('id') id: number) {
    return this.authService.verifyUser(+id);
  } 

  @Get('me')
  @UseGuards(JwtGuard, AuthenticatedGuard)
  profile(@CurrentUser() user: User) {
    return user;
  }

  @Post('/change-password')
  changePassword(@CurrentUser('id') userId: number, @Body() credentialInfo: CredentialInfo) {
      return this.authService.changePassword(userId, credentialInfo)
  }
}
