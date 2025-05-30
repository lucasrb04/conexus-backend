import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

import { AppLoggerService } from 'src/infra/logger/services/logger.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private prisma: PrismaService,
    private logger: AppLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // Busque o usuário no banco de dados com base no tipo (professor ou aluno)
      let user;

      if (payload.type === 'professor') {
        user = await this.prisma.professor.findUnique({
          where: { id: payload.sub },
        });
      } else if (payload.type === 'aluno') {
        user = await this.prisma.aluno.findUnique({
          where: { id: payload.sub },
        });
      }

      if (!user) {
        throw new UnauthorizedException();
      }
      // Anexe as informações do usuário ao objeto de solicitação
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
