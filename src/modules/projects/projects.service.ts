import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createProjetoDto: CreateProjetoDto) {
    try {
      this.logger.log(
        `[${ProjectsService.name}] - Criando projeto - ${JSON.stringify(
          createProjetoDto,
        )}`,
      );
      return this.prisma.projeto.create({
        data: createProjetoDto,
      });
    } catch (error) {
      this.logger.error(
        `[${ProjectsService.name}] - Erro ao criar projeto - ${error.message}`,
      );
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.log(`[${ProjectsService.name}] - Listando projetos`);
      return this.prisma.projeto.findMany();
    } catch (error) {
      this.logger.error(
        `[${ProjectsService.name}] - Erro ao listar projetos - ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(
        `[${ProjectsService.name}] - Buscando projeto com ID: ${id}`,
      );
      const projeto = await this.prisma.projeto.findUnique({
        where: { id },
      });

      if (!projeto) {
        this.logger.warn(
          `[${ProjectsService.name}] - Projeto com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Projeto with ID "${id}" not found`);
      }

      return projeto;
    } catch (error) {
      this.logger.error(
        `[${ProjectsService.name}] - Erro ao buscar projeto - ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateProjetoDto: UpdateProjetoDto) {
    try {
      this.logger.log(
        `[${ProjectsService.name}] - Atualizando projeto com ID: ${id}`,
      );
      return await this.prisma.projeto.update({
        where: { id },
        data: updateProjetoDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${ProjectsService.name}] - Projeto com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Projeto with ID "${id}" not found`);
      }
      this.logger.error(
        `[${ProjectsService.name}] - Erro ao atualizar projeto - ${error.message}`,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`[${ProjectsService.name}] - Deletando projeto - ${id}`);
      await this.prisma.projeto.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${ProjectsService.name}] - Projeto com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Projeto with ID "${id}" not found`);
      }
      this.logger.error(
        `[${ProjectsService.name}] - Erro ao deletar projeto - ${error.message}`,
      );
      throw error;
    }
  }
}
