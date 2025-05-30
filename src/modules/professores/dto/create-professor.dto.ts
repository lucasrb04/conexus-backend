import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessorDto {
  @ApiProperty({ description: 'Professor name' })
  @IsString()
  @MinLength(3)
  nome: string;

  @ApiProperty({ description: 'Professor email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Professor password' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ description: 'Professor department' })
  @IsString()
  departamento: string;
}
