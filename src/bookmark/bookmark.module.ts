import { UserModule } from './../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService]
})
export class BookmarkModule {}
