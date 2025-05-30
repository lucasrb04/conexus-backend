import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { ProfessoresModule } from '../modules/professores/professor.module';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { AlunoModule } from '../modules/aluno/aluno.module';
import { CourseModule } from '../modules/courses/course.module';
import { ProjectsModule } from '../modules/projects/projects.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from '../modules/auth/auth.guard';
import { PrismaService } from '../infra/prisma/prisma.service';
import { AuthModule } from '../modules/auth/auth.module';
import { AppLoggerService } from '../infra/logger/services/logger.service';
import { LoggerModule } from '../infra/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    PrismaModule,
    ProfessoresModule,
    AlunoModule,
    CourseModule,
    ProjectsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (
        reflector: Reflector,
        jwtService: JwtService,
        prismaService: PrismaService,
        appLoggerService: AppLoggerService,
      ) =>
        new AuthGuard(jwtService, reflector, prismaService, appLoggerService),
      inject: [Reflector, JwtService, PrismaService, AppLoggerService],
    },
    AppLoggerService,
  ],
})
export class AppModule {}
