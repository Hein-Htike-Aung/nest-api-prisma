import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const user: User = ctx.switchToHttp().getRequest().user;

    if (!user) {
      throw new UnauthorizedException('There is no logged in user');
    }

    if (data) {
      return user[data];
    }

    
    return user;
  },
);
