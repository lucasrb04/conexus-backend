import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@Injectable()
export class ProfessorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createProfessorDto: CreateProfessorDto) {
    try {
      this.logger.log(
        `[${ProfessorService.name}] - Criando professor - ${JSON.stringify(createProfessorDto)}`,
      );
      return await this.prisma.professor.create({ data: createProfessorDto });
    } catch (error) {
      this.logger.error(
        `[${ProfessorService.name}] - Erro ao criar professor - ${error.message}`,
      );
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.log(
        `[${ProfessorService.name}] - Listando todos os professores`,
      );
      return await this.prisma.professor.findMany();
    } catch (error) {
      this.logger.error(
        `[${ProfessorService.name}] - Erro ao listar todos os professores - ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(
        `[${ProfessorService.name}] - Buscando professor pelo id ${id}`,
      );
      const professor = await this.prisma.professor.findUnique({
        where: { id },
      });
      if (!professor) {
        this.logger.warn(
          `[${ProfessorService.name}] - Professor com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Professor with ID "${id}" not found`);
      }
      return professor;
    } catch (error) {
      this.logger.error(
        `[${ProfessorService.name}] - Erro ao buscar professor - ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateProfessorDto: UpdateProfessorDto) {
    try {
      this.logger.log(
        `[${ProfessorService.name}] - Atualizando professor ${id} - ${JSON.stringify(updateProfessorDto)}`,
      );
      return await this.prisma.professor.update({
        where: { id },
        data: updateProfessorDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${ProfessorService.name}] - Professor com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Professor with ID "${id}" not found`);
      }
      this.logger.error(
        `[${ProfessorService.name}] - Erro ao atualizar professor - ${error.message}`,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`[${ProfessorService.name}] - Removendo professor ${id}`);
      await this.prisma.professor.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${ProfessorService.name}] - Professor com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Professor with ID "${id}" not found`);
      }
      this.logger.error(
        `[${ProfessorService.name}] - Erro ao remover professor - ${error.message}`,
      );
      throw error;
    }
  }
}
