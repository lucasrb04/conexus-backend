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
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('professores') // Adiciona uma tag para organizar as APIs
@Controller('professores')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Professor created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createProfessorDto: CreateProfessorDto) {
    try {
      console.log(
        `[${ProfessorController.name}] - Criando professor - ${JSON.stringify(createProfessorDto)}`,
      );
      return await this.professorService.create(createProfessorDto);
    } catch (error) {
      console.error(
        `[${ProfessorController.name}] - Erro ao criar professor - ${error.message}`,
      );
      throw error;
    }
  }

  @Get()
  @ApiOkResponse({ description: 'List of professors' })
  async findAll() {
    try {
      console.log(
        `[${ProfessorController.name}] - Listando todos os professores`,
      );
      return await this.professorService.findAll();
    } catch (error) {
      console.error(
        `[${ProfessorController.name}] - Erro ao listar todos os professores - ${error.message}`,
      );
      throw error;
    }
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Professor found' })
  @ApiNotFoundResponse({ description: 'Professor not found' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      console.log(
        `[${ProfessorController.name}] - Buscando professor pelo id ${id}`,
      );
      return await this.professorService.findOne(id);
    } catch (error) {
      console.error(
        `[${ProfessorController.name}] - Erro ao buscar professor pelo id - ${error.message}`,
      );
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'Professor updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Professor not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    try {
      console.log(
        `[${ProfessorController.name}] - Atualizando professor ${id} - ${JSON.stringify(updateProfessorDto)}`,
      );
      return await this.professorService.update(id, updateProfessorDto);
    } catch (error) {
      console.error(
        `[${ProfessorController.name}] - Erro ao atualizar professor - ${error.message}`,
      );
      throw error;
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Professor deleted successfully' })
  @ApiNotFoundResponse({ description: 'Professor not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      console.log(`[${ProfessorController.name}] - Removendo professor ${id}`);
      await this.professorService.remove(id);
    } catch (error) {
      console.error(
        `[${ProfessorController.name}] - Erro ao remover professor - ${error.message}`,
      );
      throw error;
    }
  }
}
