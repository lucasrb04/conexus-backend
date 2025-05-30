// curso.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-curso.dto';
import { UpdateCourseDto } from './dto/update-curso.dto';
import { CourseProjetosEstatisticasDto } from './dto/curso-projeto-estatisticas.dto';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      this.logger.log(
        `[${CourseService.name}] - Criando curso - ${JSON.stringify(createCourseDto)}`,
      );
      return await this.prisma.curso.create({
        data: createCourseDto,
      });
    } catch (error) {
      this.logger.error(
        `[${CourseService.name}] - Erro ao criar curso - ${error.message}`,
      );
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.log(`[${CourseService.name}] - Listando todos os cursos`);
      return await this.prisma.curso.findMany();
    } catch (error) {
      this.logger.error(
        `[${CourseService.name}] - Erro ao listar todos os cursos - ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`[${CourseService.name}] - Buscando curso pelo id ${id}`);
      const curso = await this.prisma.curso.findUnique({
        where: { id },
      });

      if (!curso) {
        this.logger.warn(
          `[${CourseService.name}] - Curso com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Curso with ID "${id}" not found`);
      }

      return curso;
    } catch (error) {
      this.logger.error(
        `[${CourseService.name}] - Erro ao buscar curso - ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      this.logger.log(
        `[${CourseService.name}] - Atualizando curso ${id} - ${JSON.stringify(updateCourseDto)}`,
      );
      return await this.prisma.curso.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${CourseService.name}] - Course com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Course with ID "${id}" not found`);
      }
      this.logger.error(
        `[${CourseService.name}] - Erro ao atualizar curso - ${error.message}`,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`[${CourseService.name}] - Removendo curso ${id}`);
      await this.prisma.curso.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${CourseService.name}] - Curso com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Curso with ID "${id}" not found`);
      }
      this.logger.error(
        `[${CourseService.name}] - Erro ao remover curso - ${error.message}`,
      );
      throw error;
    }
  }

  async getCourseProjetosEstatisticas(): Promise<
    CourseProjetosEstatisticasDto[]
  > {
    try {
      this.logger.log(
        `[${CourseService.name}] - Buscando estatísticas de projetos por curso`,
      );
      const cursos = await this.prisma.curso.findMany({
        select: {
          id: true,
          nome: true,
        },
      });

      const estatisticas = await Promise.all(
        cursos.map(async (curso) => {
          const numeroProjetos = await this.prisma.cursosProjetos.count({
            where: { cursoId: curso.id },
          });
          return {
            cursoId: curso.id,
            cursoNome: curso.nome,
            numeroProjetos: numeroProjetos,
          };
        }),
      );

      return estatisticas;
    } catch (error) {
      this.logger.error(
        `[${CourseService.name}] - Erro ao buscar estatísticas de projetos por curso - ${error.message}`,
      );
      throw error;
    }
  }
}
