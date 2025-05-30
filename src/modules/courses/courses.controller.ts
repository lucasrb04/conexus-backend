// course.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from './courses.service';
import { CreateCourseDto } from './dto/create-curso.dto';
import { UpdateCourseDto } from './dto/update-curso.dto';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CourseProjetosEstatisticasDto } from './dto/curso-projeto-estatisticas.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly logger: AppLoggerService,
  ) {}

  @Public()
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new course' })
  @ApiCreatedResponse({
    description: 'The course has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      this.logger.log(
        `[${CourseController.name}] - Criando curso - ${JSON.stringify(createCourseDto)}`,
      );
      return await this.courseService.create(createCourseDto);
    } catch (error) {
      this.logger.error(
        `[${CourseController.name}] - Erro ao criar curso - ${error.message}`,
      );
      throw error;
    }
  }

  @Get('getAll')
  @ApiOperation({ summary: 'List all courses' })
  @ApiOkResponse({ description: 'A list of courses.' })
  async findAll() {
    try {
      this.logger.log(`[${CourseController.name}] - Listando todos os cursos`);
      return await this.courseService.findAll();
    } catch (error) {
      this.logger.error(
        `[${CourseController.name}] - Erro ao listar todos os cursos - ${error.message}`,
      );
      throw error;
    }
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Course ID',
  })
  @ApiOkResponse({ description: 'The course.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.logger.log(
        `[${CourseController.name}] - Buscando curso pelo id ${id}`,
      );
      return await this.courseService.findOne(id);
    } catch (error) {
      this.logger.error(
        `[${CourseController.name}] - Erro ao buscar curso pelo id - ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Course ID',
  })
  @ApiOkResponse({ description: 'The course has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    try {
      this.logger.log(
        `[${CourseController.name}] - Atualizando curso ${id} - ${JSON.stringify(updateCourseDto)}`,
      );
      return await this.courseService.update(id, updateCourseDto);
    } catch (error) {
      this.logger.error(
        `[${CourseController.name}] - Erro ao atualizar curso - ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Course ID',
  })
  @ApiNoContentResponse({
    description: 'The course has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Course not found.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.logger.log(`[${CourseController.name}] - Removendo curso ${id}`);
      await this.courseService.remove(id);
    } catch (error) {
      this.logger.error(
        `[${CourseController.name}] - Erro ao remover curso - ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get('statistics/projectss')
  @ApiOperation({ summary: 'Get project statistics per course' })
  @ApiOkResponse({
    type: CourseProjetosEstatisticasDto,
    isArray: true,
    description: 'Project statistics per course.',
  })
  async getCourseProjetosEstatisticas(): Promise<
    CourseProjetosEstatisticasDto[]
  > {
    try {
      this.logger.log(
        `[${CourseController.name}] - Buscando estatísticas de projetos por curso`,
      );
      return await this.courseService.getCourseProjetosEstatisticas();
    } catch (error) {
      this.logger.error(
        `[${CourseController.name}] - Erro ao buscar estatísticas de projetos por curso - ${error.message}`,
      );
      throw error;
    }
  }
}
