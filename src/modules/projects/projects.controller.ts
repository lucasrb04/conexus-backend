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
import { ProjectsService } from './projects.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
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
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly logger: AppLoggerService,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({
    description: 'The project has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  async create(@Body() createProjetoDto: CreateProjetoDto) {
    try {
      this.logger.log(
        `[${ProjectsController.name}] - Criando projeto - ${JSON.stringify(createProjetoDto)}`,
      );
      return this.projectsService.create(createProjetoDto);
    } catch (error) {
      this.logger.error(
        `[${ProjectsController.name}] - Erro ao criar projeto - ${error.message}`,
      );
      throw error;
    }
  }

  @Get('getAll')
  @ApiOperation({ summary: 'List all projects' })
  @ApiOkResponse({ description: 'A list of projects.' })
  async findAll() {
    try {
      this.logger.log(`[${ProjectsController.name}] - Listando projetos`);
      return await this.projectsService.findAll();
    } catch (error) {
      this.logger.error(
        `[${ProjectsController.name}] - Erro ao listar projetos - ${error.message}`,
      );
      throw error;
    }
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Project ID',
  })
  @ApiOkResponse({ description: 'The project.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.logger.log(
        `[${ProjectsController.name}] - Buscando projeto - ${id}`,
      );
      return await this.projectsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(
          `[${ProjectsController.name}] - Projeto não encontrado - ${error.message}`,
        );

        throw error;
      }
      this.logger.error(
        `[${ProjectsController.name}] - Erro ao buscar projeto - ${error.message}`,
      );
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Project ID',
  })
  @ApiOkResponse({ description: 'The project has been successfully updated.' })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    try {
      this.logger.log(
        `[${ProjectsController.name}] - Atualizando projeto - ${id} - ${JSON.stringify(
          updateProjetoDto,
        )}`,
      );
      return await this.projectsService.update(id, updateProjetoDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(
          `[${ProjectsController.name}] - Projeto não encontrado - ${error.message}`,
        );
        throw error;
      }
      this.logger.error(
        `[${ProjectsController.name}] - Erro ao atualizar projeto - ${error.message}`,
      );
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Project ID',
  })
  @ApiNoContentResponse({
    description: 'The project has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Project not found.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      this.logger.log(
        `[${ProjectsController.name}] - Deletando projeto - ${id}`,
      );
      await this.projectsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(
          `[${ProjectsController.name}] - Projeto não encontrado - ${error.message}`,
        );
        throw error;
      }
      this.logger.error(
        `[${ProjectsController.name}] - Erro ao deletar projeto - ${error.message}`,
      );
      throw error;
    }
  }
}
