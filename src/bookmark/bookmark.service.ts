import { Prisma } from '@prisma/client';
import { UserService } from './../user/user.service';
import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    // Resolving Circular Dependency
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  async create(currentUserId: number, createBookmarkDto: CreateBookmarkDto) {
    const categories = createBookmarkDto.categories?.map((category) => {
      return {
        id: +category,
      };
    });

    try {
      const newBookmark = await this.prisma.bookmark.create({
        data: {
          ...createBookmarkDto,
          user: {
            connect: {
              id: currentUserId,
            },
          },
          // userId: currentUserId,
          categories: {
            connect: categories,
          },
        },
      });

      const bookmarkOwner = await this.userService.findOne(newBookmark.userId);

      this.userService.update(newBookmark.userId, {
        bookMarkCount: ++bookmarkOwner.bookMarkCount,
      });

      return createBookmarkDto;
    } catch (error) {
      throw new ForbiddenException('Already Existed');
    }
  }

  async findAll(query: Prisma.BookmarkInclude) {
    return await this.prisma.bookmark.findMany({ include: query });
  }

  async findCurrentUserBookmarks(currentUserId: number) {
    return await this.prisma.bookmark.findMany({
      where: { userId: currentUserId },
    });
  }

  async findOne(currentUserId: number, id: number) {
    return await this.find_CheckBookmark(currentUserId, id);
  }

  async update(
    currentUserId: number,
    id: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    const categories = updateBookmarkDto.categories?.map((category) => {
      return {
        id: +category,
      };
    });

    try {
      await this.find_CheckBookmark(currentUserId, id);

      return await this.prisma.bookmark.update({
        where: { id },
        data: {
          ...updateBookmarkDto,
          user: {
            connect: {
              id: currentUserId,
            },
          },
          // userId: currentUserId,
          categories: {
            set: categories,
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException('Already Existed');
    }
  }

  async remove(currentUserId: number, id: number) {
    await this.find_CheckBookmark(currentUserId, id);

    return await this.prisma.bookmark.delete({
      where: { id: id },
    });
  }

  private async find_CheckBookmark(currentUserId: number, id: number) {
    const storedBookmark = await this.prisma.bookmark.findUnique({
      where: { id },
    });

    if (!storedBookmark || storedBookmark.userId !== currentUserId)
      throw new ForbiddenException('Access denied to resource');

    return storedBookmark;
  }
}
