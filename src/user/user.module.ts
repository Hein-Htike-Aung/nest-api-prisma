import { BookmarkModule } from './../bookmark/bookmark.module';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [forwardRef(() => BookmarkModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
