import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateProfessorDto } from 'src/modules/professores/dto/create-professor.dto';
import { CreateAlunoDto } from 'src/modules/aluno/dto/create-aluno.dto';
import { ResponseLoginDto } from './dto/responseLogin.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from './public.decorator';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: AppLoggerService,
  ) {}

  @Public()
  @Post('register/professor')
  @ApiOperation({ summary: 'Register a new professor' })
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateProfessorDto,
    description: 'Professor registration details',
  })
  @ApiCreatedResponse({ description: 'Professor registered successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  registerProfessor(@Body() createProfessorDto: CreateProfessorDto) {
    try {
      this.logger.log(
        `[${AuthController.name}] - Registering professor - ${JSON.stringify(
          createProfessorDto,
        )}`,
      );
      return this.authService.registerProfessor(createProfessorDto);
    } catch (error) {
      this.logger.error(
        `[${AuthController.name}] - Error registering professor - ${error.message}`,
      );
      throw error;
    }
  }

  @Public()
  @Post('register/aluno')
  @ApiOperation({ summary: 'Register a new student' })
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateAlunoDto,
    description: 'Student registration details',
  })
  @ApiCreatedResponse({ description: 'Student registered successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  registerAluno(@Body() createAlunoDto: CreateAlunoDto) {
    try {
      this.logger.log(
        `[${AuthController.name}] - Registering student - ${JSON.stringify(
          createAlunoDto,
        )}`,
      );
      return this.authService.registerAluno(createAlunoDto);
    } catch (error) {
      this.logger.error(
        `[${AuthController.name}] - Error registering student - ${error.message}`,
      );
      throw error;
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ResponseLoginDto, description: 'Login credentials' })
  @ApiCreatedResponse({ description: 'Login successful' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  login(@Body() loginDto: ResponseLoginDto) {
    try {
      this.logger.log(
        `[${AuthController.name}] - Logging in - ${JSON.stringify(loginDto)}`,
      );
      return this.authService.login(loginDto);
    } catch (error) {
      this.logger.error(
        `[${AuthController.name}] - Error logging in - ${error.message}`,
      );
      throw error;
    }
  }
}
