import { CategoryQueryDto } from './dto/query.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisam: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisam.category.create({ data: createCategoryDto });
    } catch (error) {
      throw new ForbiddenException('Category Name is already existed');
    }
  }

  findAll(query: Prisma.CategoryInclude) {
    return this.prisam.category.findMany({ include: query });
  }

  async findOne(id: number) {
    return await this.find_CheckCategory(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.find_CheckCategory(id);

    try {
      return await this.prisam.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new ForbiddenException('Category Name is already existed');
    }
  }

  async updateSubCategory(categoryId: number, parentCategoryId: number) {
    return await this.prisam.category.update({
      where: { id: categoryId },
      data: {
        parentCategory: {
          connect: {
            id: parentCategoryId,
          },
        },
      },
      include: {
        parentCategory: true,
      },
    });
  }

  async remove(id: number) {
    await this.find_CheckCategory(id);

    return this.prisam.category.delete({ where: { id } });
  }

  private async find_CheckCategory(id: number) {
    const category = await this.prisam.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`There is no category with id ${id}`);
    }

    return category;
  }
}
