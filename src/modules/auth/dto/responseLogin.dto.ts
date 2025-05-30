import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseLoginDto {
  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  senha: string;

  @ApiProperty({ description: 'User role', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  userType: string;
}
