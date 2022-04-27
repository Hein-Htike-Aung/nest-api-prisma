import { JwtGuard } from './../common/guards/jwt.guard';
import { isEmpty } from './../utils/is-emtpy-object';
import { CategoryQueryDto } from './dto/query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() categoryQueryDto: CategoryQueryDto) {
    return this.categoryService.findAll(isEmpty(categoryQueryDto) ? null : categoryQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Patch('/update/subcategory/:categoryId')
  updateSubCategory(@Param('categoryId') categoryId: number, @Body() category: {parentCategoryId: number}) {
    return this.categoryService.updateSubCategory(+categoryId, category.parentCategoryId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
