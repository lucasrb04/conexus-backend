import { IsString, IsEmail, MinLength, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlunoDto {
  @ApiProperty({ description: 'Aluno name', example: 'John Doe' })
  @IsString()
  @MinLength(3)
  nome: string;

  @ApiProperty({ description: 'Aluno email', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Aluno password', example: 'password123' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ description: 'Curso ID', example: 'uuid' })
  @IsString()
  @IsUUID()
  cursoId: string;

  @ApiProperty({ description: 'Aluno period', example: 3 })
  @IsInt()
  periodo: number;
}
