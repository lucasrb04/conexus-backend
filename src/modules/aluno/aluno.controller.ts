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
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiNoContentResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RecomendacaoProjetoDto } from './dto/recomendacoes.dto';
import { AlunoEstatisticasDto } from './dto/statistcs.dto';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@ApiTags('alunos')
@Controller('alunos')
export class AlunoController {
  constructor(
    private readonly alunoService: AlunoService,
    private readonly logger: AppLoggerService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new student' })
  @ApiCreatedResponse({
    description: 'The student has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async create(@Body() createAlunoDto: CreateAlunoDto) {
    try {
      this.logger.log(
        `[${AlunoController.name}] - Criando aluno - ${JSON.stringify(createAlunoDto)}`,
      );
      return await this.alunoService.create(createAlunoDto);
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao criar aluno - ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post(':alunoId/projetos/:projetoId/candidatar')
  @ApiOperation({ summary: 'Apply a student to a project' })
  @ApiParam({
    name: 'alunoId',
    type: String,
    format: 'uuid',
    description: 'Student ID',
  })
  @ApiParam({
    name: 'projetoId',
    type: String,
    format: 'uuid',
    description: 'Project ID',
  })
  @ApiCreatedResponse({
    description: 'The student has been successfully applied to the project.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or project has no vacancies.',
  })
  @ApiNotFoundResponse({ description: 'Student or project not found.' })
  @HttpCode(HttpStatus.CREATED)
  async applyToProject(
    @Param('alunoId', new ParseUUIDPipe()) alunoId: string,
    @Param('projetoId', new ParseUUIDPipe()) projetoId: string,
  ) {
    try {
      this.logger.log(
        `[${AlunoController.name}] - Candidatando aluno ${alunoId} ao projeto ${projetoId}`,
      );
      await this.alunoService.applyToProject(alunoId, projetoId);
      return { message: 'Aluno candidatado ao projeto com sucesso.' };
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao candidatar aluno ao projeto - ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':alunoId/projetos/recomendados')
  @ApiOperation({ summary: 'Get recommended projects for a student' })
  @ApiParam({
    name: 'alunoId',
    type: String,
    format: 'uuid',
    description: 'Student ID',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Maximum number of projects to return',
  })
  @ApiOkResponse({
    type: RecomendacaoProjetoDto,
    isArray: true,
    description: 'A list of recommended projects.',
  })
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async getRecommendedProjects(
    @Param('alunoId', new ParseUUIDPipe()) alunoId: string,
    @Query('limit') limit?: number,
  ): Promise<RecomendacaoProjetoDto[]> {
    try {
      this.logger.log(
        `[${AlunoController.name}] - Buscando projetos recomendados para o aluno ${alunoId} (limite: ${limit})`,
      );
      return await this.alunoService.getRecommendedProjects(alunoId, +limit);
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao buscar projetos recomendados - ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':alunoId/estatisticas')
  @ApiOperation({ summary: 'Get statistics for a student' })
  @ApiParam({
    name: 'alunoId',
    type: String,
    format: 'uuid',
    description: 'Student ID',
  })
  @ApiOkResponse({
    type: AlunoEstatisticasDto,
    description: 'Student statistics.',
  })
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async getAlunoEstatisticas(
    @Param('alunoId', new ParseUUIDPipe()) alunoId: string,
  ): Promise<AlunoEstatisticasDto> {
    try {
      this.logger.log(
        `[${AlunoController.name}] - Buscando estatísticas do aluno ${alunoId}`,
      );
      return await this.alunoService.getAlunoEstatisticas(alunoId);
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao buscar estatísticas do aluno - ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all students' })
  @ApiOkResponse({ description: 'A list of students.' })
  async findAll() {
    try {
      this.logger.log(`[${AlunoController.name}] - Listando todos os alunos`);
      return await this.alunoService.findAll();
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao listar todos os alunos - ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Student ID',
  })
  @ApiOkResponse({ description: 'The student.' })
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.logger.log(
        `[${AlunoController.name}] - Buscando aluno pelo id ${id}`,
      );
      return await this.alunoService.findOne(id);
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao buscar aluno pelo id - ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Student ID',
  })
  @ApiOkResponse({ description: 'The student has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlunoDto: UpdateAlunoDto,
  ) {
    try {
      this.logger.log(
        `[${AlunoController.name}] - Atualizando aluno ${id} - ${JSON.stringify(updateAlunoDto)}`,
      );
      return await this.alunoService.update(id, updateAlunoDto);
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao atualizar aluno - ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Student ID',
  })
  @ApiNoContentResponse({
    description: 'The student has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Student not found.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.logger.log(`[${AlunoController.name}] - Removendo aluno ${id}`);
      await this.alunoService.remove(id);
    } catch (error) {
      this.logger.error(
        `[${AlunoController.name}] - Erro ao remover aluno - ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
