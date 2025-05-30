import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course name', example: 'Computer Science' })
  @IsString()
  @MinLength(3)
  nome: string;
}
