import { isEmpty } from './../utils/is-emtpy-object';
import { UserQueryDto } from './dto/query.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtGuard } from './../common/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() userQueryDto: UserQueryDto) {
    return this.userService.findAll(
      isEmpty(userQueryDto) ? null : userQueryDto,
    );
  }

  @Get('/by-id/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('/current-user/bookmarks')
  findLoggedInUserBookmarks(@CurrentUser('id') userId: number) {
    return this.userService.findLoggedInUserBookmarks(+userId);
  }

  @Patch()
  update(@CurrentUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('update/editor/:userId')
  updateEditor(@Param('userId') userId: number, @Body() editor: {editorId: number}) {
    return this.userService.updateUser_Editor(+userId, editor.editorId);
  }

  @Patch('update/publisher/:userId')
  updatePublisher(@Param('userId') userId: number, @Body() author: {authorId: number}) {
    return this.userService.updateUser_Publisher(+userId, author.authorId);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(id);
    return this.userService.remove(+id);
  }
}
