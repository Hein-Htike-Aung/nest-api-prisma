import { PartialType } from '@nestjs/mapped-types';
import { Address } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  bookMarkCount?: number;

  @IsOptional()
  address?: Address
}
