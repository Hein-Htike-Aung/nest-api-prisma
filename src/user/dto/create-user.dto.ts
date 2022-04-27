import { Address } from '@prisma/client';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  bookMarkCount?: number;

  @IsOptional()
  address?: Address
}
