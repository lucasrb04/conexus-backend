// update-curso.dto.ts
import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'Course name',
    example: 'Computer Science',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  nome?: string;
}
