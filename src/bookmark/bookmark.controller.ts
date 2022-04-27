import { isEmpty } from './../utils/is-emtpy-object';
import { JwtGuard } from './../common/guards/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BookmarkQueryDto } from './dto/query.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(
    @CurrentUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.create(userId, createBookmarkDto);
  }

  @Get('')
  findAll(@Query() bookmarkQueryDto: BookmarkQueryDto) {
    return this.bookmarkService.findAll(isEmpty(bookmarkQueryDto) ? null : bookmarkQueryDto);
  }

  @Get('/current-user')
  findCurrentUserBookmarks(@CurrentUser('id') id: number) {
    return this.bookmarkService.findCurrentUserBookmarks(id);
  }

  @Get(':id')
  findOne(@CurrentUser('id') currentUserId: number, @Param('id') id: string) {
    return this.bookmarkService.findOne(currentUserId, +id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') currentUserId: number,
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(currentUserId, +id, updateBookmarkDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@CurrentUser('id') currentUserId: number, @Param('id') id: string) {
    return this.bookmarkService.remove(currentUserId, +id);
  }
}
