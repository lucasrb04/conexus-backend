import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { RecomendacaoProjetoDto } from './dto/recomendacoes.dto';
import { AlunoEstatisticasDto } from './dto/statistcs.dto';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@Injectable()
export class AlunoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLoggerService,
  ) {}

  async create(createAlunoDto: CreateAlunoDto) {
    try {
      this.logger.log(
        `[${AlunoService.name}] - Criando aluno - ${JSON.stringify(createAlunoDto)}`,
      );
      return await this.prisma.aluno.create({
        data: createAlunoDto,
      });
    } catch (error) {
      this.logger.error(
        `[${AlunoService.name}] - Erro ao criar aluno - ${error.message}`,
      );
      throw error;
    }
  }

  async applyToProject(alunoId: string, projetoId: string) {
    try {
      this.logger.log(
        `[${AlunoService.name}] - Candidatando aluno ${alunoId} ao projeto ${projetoId}`,
      );

      // Check if the student and project exist
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: alunoId },
      });
      const projeto = await this.prisma.projeto.findUnique({
        where: { id: projetoId },
      });

      if (!aluno) {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno com ID "${alunoId}" não encontrado`,
        );
        throw new NotFoundException(`Aluno with ID "${alunoId}" not found`);
      }

      if (!projeto) {
        this.logger.warn(
          `[${AlunoService.name}] - Projeto com ID "${projetoId}" não encontrado`,
        );
        throw new NotFoundException(`Projeto with ID "${projetoId}" not found`);
      }

      // Check if the project has vacancies
      if (projeto.vagas <= 0) {
        this.logger.warn(
          `[${AlunoService.name}] - Projeto com ID "${projetoId}" não possui vagas disponíveis`,
        );
        throw new BadRequestException(
          `Project with ID "${projetoId}" has no vacancies`,
        );
      }

      // Check if the student is already applied to the project
      const existingApplication = await this.prisma.inscricao.findFirst({
        where: {
          AND: [
            {
              alunoId: alunoId,
              projetoId: projetoId,
            },
          ],
        },
      });

      if (existingApplication) {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno ${alunoId} já está candidatado ao projeto ${projetoId}`,
        );
        throw new BadRequestException(
          `Aluno with ID "${alunoId}" is already applied to project with ID "${projetoId}"`,
        );
      }

      // Create the application
      this.logger.log(
        `[${AlunoService.name}] - Criando inscrição para aluno ${alunoId} no projeto ${projetoId}`,
      );
      await this.prisma.inscricao.create({
        data: {
          alunoId: alunoId,
          projetoId: projetoId,
          status: 'PENDENTE', // You can set the initial status here
        },
      });

      // Update the project vacancies
      this.logger.log(
        `[${AlunoService.name}] - Atualizando vagas do projeto ${projetoId}`,
      );
      await this.prisma.projeto.update({
        where: { id: projetoId },
        data: {
          vagas: projeto.vagas - 1,
        },
      });
    } catch (error) {
      this.logger.error(
        `[${AlunoService.name}] - Erro ao candidatar aluno ao projeto - ${error.message}`,
      );
      throw error;
    }
  }

  async findAll() {
    try {
      this.logger.log(`[${AlunoService.name}] - Listando todos os alunos`);
      return await this.prisma.aluno.findMany();
    } catch (error) {
      this.logger.error(
        `[${AlunoService.name}] - Erro ao listar alunos - ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`[${AlunoService.name}] - Buscando aluno pelo id ${id}`);
      const aluno = await this.prisma.aluno.findUnique({
        where: { id },
        include: {
          curso: true,
          inscricoes: true,
        },
      });
      if (!aluno) {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Aluno with ID "${id}" not found`);
      }

      return aluno;
    } catch (error) {
      this.logger.error(
        `[${AlunoService.name}] - Erro ao buscar aluno - ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateAlunoDto: UpdateAlunoDto) {
    try {
      this.logger.log(
        `[${AlunoService.name}] - Atualizando aluno ${id} - ${JSON.stringify(updateAlunoDto)}`,
      );
      return await this.prisma.aluno.update({
        where: { id },
        data: {
          cursoId: updateAlunoDto.cursoId,
          email: updateAlunoDto.email,
          nome: updateAlunoDto.nome,
          periodo: updateAlunoDto.periodo,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Aluno with ID "${id}" not found`);
      }
      this.logger.error(
        `[${AlunoService.name}] - Erro ao atualizar aluno - ${error.message}`,
      );
      throw error;
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`[${AlunoService.name}] - Removendo aluno ${id}`);
      await this.prisma.aluno.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno com ID "${id}" não encontrado`,
        );
        throw new NotFoundException(`Aluno with ID "${id}" not found`);
      }
      this.logger.error(
        `[${AlunoService.name}] - Erro ao remover aluno - ${error.message}`,
      );
      throw error;
    }
  }

  async getRecommendedProjects(
    alunoId: string,
    limit?: number,
  ): Promise<RecomendacaoProjetoDto[]> {
    try {
      this.logger.log(
        `[${AlunoService.name}] - Buscando projetos recomendados para aluno ${alunoId} (limite: ${limit})`,
      );
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: alunoId },
        include: {
          curso: true,
        },
      });

      if (!aluno) {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno com ID "${alunoId}" não encontrado`,
        );
        throw new NotFoundException(`Aluno with ID "${alunoId}" not found`);
      }

      const projetos = await this.prisma.projeto.findMany({
        where: {
          cursosProjetos: {
            some: {
              cursoId: aluno.cursoId,
            },
          },
        },
        take: limit || undefined, // Apply the limit if provided
        include: {
          professor: true,
        },
      });

      return projetos.map((projeto) => ({
        id: projeto.id,
        nome: projeto.nome,
        descricao: projeto.descricao,
        professor: projeto.professor.nome,
        vagas: projeto.vagas,
      }));
    } catch (error) {
      this.logger.error(
        `[${AlunoService.name}] - Erro ao buscar projetos recomendados - ${error.message}`,
      );
      throw error;
    }
  }

  async getAlunoEstatisticas(alunoId: string): Promise<AlunoEstatisticasDto> {
    try {
      this.logger.log(
        `[${AlunoService.name}] - Buscando estatísticas do aluno ${alunoId}`,
      );
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: alunoId },
      });

      if (!aluno) {
        this.logger.warn(
          `[${AlunoService.name}] - Aluno com ID "${alunoId}" não encontrado`,
        );
        throw new NotFoundException(`Aluno with ID "${alunoId}" not found`);
      }

      const totalCandidaturas = await this.prisma.inscricao.count({
        where: { alunoId: alunoId },
      });

      const projetosAtivos = await this.prisma.inscricao.count({
        where: { alunoId: alunoId, status: 'EM_ANDAMENTO' }, // Ajuste o status conforme necessário
      });

      const projetosConcluidos = await this.prisma.inscricao.count({
        where: { alunoId: alunoId, status: 'CONCLUIDO' }, // Ajuste o status conforme necessário
      });

      const candidaturasAprovadas = await this.prisma.inscricao.count({
        where: { alunoId: alunoId, status: 'APROVADA' },
      });

      const candidaturasReprovadas = await this.prisma.inscricao.count({
        where: { alunoId: alunoId, status: 'REPROVADA' },
      });
      const inscricoes = await this.prisma.inscricao.findMany({
        where: { alunoId: alunoId, status: 'APROVADA' },
      });

      let tempoTotalEspera = 0;
      let quantidadeAprovadas = 0;

      for (const inscricao of inscricoes) {
        if (inscricao.dataInscricao) {
          const dataAprovacao = new Date();
          const dataInscricao = new Date(inscricao.dataInscricao);
          const tempoEspera = dataAprovacao.getTime() - dataInscricao.getTime();
          tempoTotalEspera += tempoEspera;
          quantidadeAprovadas++;
        }
      }

      const tempoMedioEsperaEmDias =
        quantidadeAprovadas > 0
          ? tempoTotalEspera / quantidadeAprovadas / (1000 * 60 * 60 * 24)
          : 0;

      return {
        totalCandidaturas,
        projetosAtivos,
        projetosConcluidos,
        candidaturasAprovadas,
        candidaturasReprovadas,
        tempoMedioEspera: tempoMedioEsperaEmDias,
      };
    } catch (error) {
      this.logger.error(
        `[${AlunoService.name}] - Erro ao buscar estatísticas do aluno - ${error.message}`,
      );
      throw error;
    }
  }
}
