import { BookmarkService } from './../bookmark/bookmark.service';
import { Prisma, User, Address } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';
import { create } from 'domain';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    // Resolving Circular Dependency
    @Inject(forwardRef(() => BookmarkService))
    private bookmarkService: BookmarkService,
  ) {}

  async findAll(query: Prisma.UserInclude) {
    const users = await this.prisma.user.findMany({
      include: query,
    });
    users.forEach((user) => delete user.password);
    return users;
  }

  async findOne(id: number) {
    const user = await this.find_CheckUser(id);

    delete user.password;

    return user;
  }

  async findLoggedInUserBookmarks(currentUserId: number) {
    return await this.bookmarkService.findCurrentUserBookmarks(currentUserId);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user: User = await this.find_CheckUser(id);

    const addressAction = user.address
      ? { update: updateUserDto.address }
      : { create: updateUserDto.address };

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: user.password,
          address: addressAction,
        },
      });

      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential Taken');
        }
      }

      throw error;
    }
  }

  async updateUser_Editor(userId: number, editorId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        editor: {
          connect: {
            id: editorId,
          },
        },
      },
      include: {
        editor: true,
      },
    });
  }

  async updateUser_Publisher(userId: number, authorId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        publishers: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        publishers: true
      },
    });
  }

  async remove(id: number) {
    await this.find_CheckUser(id);

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    delete deletedUser.password;
    return deletedUser;
  }

  async find_CheckUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
      },
    });

    if (!user) {
      throw new ForbiddenException(`There is no user with id - ${id}`);
    }

    return user;
  }
}
