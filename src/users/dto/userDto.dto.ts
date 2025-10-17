import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
