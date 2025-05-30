import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateProfessorDto } from 'src/modules/professores/dto/create-professor.dto';
import { CreateAlunoDto } from 'src/modules/aluno/dto/create-aluno.dto';
import { ResponseLoginDto } from './dto/responseLogin.dto';
import * as bcrypt from 'bcrypt';
import { AppLoggerService } from 'src/infra/logger/services/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly logger: AppLoggerService,
  ) {}

  async registerProfessor(createProfessorDto: CreateProfessorDto) {
    const hashedPassword = await bcrypt.hash(createProfessorDto.senha, 10);
    const professor = await this.prisma.professor.create({
      data: {
        ...createProfessorDto,
        senha: hashedPassword,
      },
    });

    const payload = {
      sub: professor.id,
      email: professor.email,
      userType: 'professor',
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerAluno(createAlunoDto: CreateAlunoDto) {
    this.logger.log('Registering aluno');
    const hashedPassword = await bcrypt.hash(createAlunoDto.senha, 10);
    const aluno = await this.prisma.aluno.create({
      data: {
        ...createAlunoDto,
        senha: hashedPassword,
      },
    });

    const payload = { sub: aluno.id, email: aluno.email, type: 'aluno' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: ResponseLoginDto) {
    try {
      const { email, senha } = loginDto;

      const professor = await this.prisma.professor.findUnique({
        where: { email },
      });
      const aluno = await this.prisma.aluno.findUnique({ where: { email } });

      const user = professor || aluno;

      if (!user) {
        this.logger.warn(
          `[${AuthService.name}] - Usuário não encontrado com email: ${email}`,
        );
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);

      if (!isPasswordValid) {
        this.logger.warn(
          `[${AuthService.name}] - Senha inválida para o usuário: ${email}`,
        );
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        type: professor ? 'professor' : 'aluno',
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error(
        `[${AuthService.name}] - Erro durante o login - ${error.message}`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
