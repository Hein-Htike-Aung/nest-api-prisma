import { JwtGuard } from './common/guards/jwt.guard';
import { PrismaService } from './prisma/prisma.service';
import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    BookmarkModule,
    AuthModule,
    CategoryModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
