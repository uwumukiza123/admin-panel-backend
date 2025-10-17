import { IsString, IsOptional } from 'class-validator';

// All fields are optional because this is a partial update (PATCH)
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
