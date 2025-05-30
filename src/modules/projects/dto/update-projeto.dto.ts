import { IsString, IsNumber, IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjetoStatus, ProjetoTipo } from '@prisma/client';

export class UpdateProjetoDto {
    @ApiPropertyOptional({ description: 'Project name', example: 'Desenvolvimento de um Sistema de Recomendação' })
    @IsString()
    @IsOptional()
    nome?: string;

    @ApiPropertyOptional({ description: 'Project description', example: 'Este projeto tem como objetivo...' })
    @IsString()
    @IsOptional()
    descricao?: string;

    @ApiPropertyOptional({ description: 'Professor ID', example: 'uuid' })
    @IsUUID()
    @IsOptional()
    professorId?: string;

    @ApiPropertyOptional({ description: 'Project requirements', example: 'Conhecimento em Python e Machine Learning' })
    @IsString()
    @IsOptional()
    requisitos?: string;

    @ApiPropertyOptional({ description: 'Number of vacancies', example: 2 })
    @IsNumber()
    @IsOptional()
    vagas?: number;

    @ApiPropertyOptional({ description: 'Project scholarship value', example: 400.00 })
    @IsNumber()
    @IsOptional()
    bolsa?: number;

    @ApiPropertyOptional({ description: 'Project start date', example: '2024-01-01' })
    @IsDateString()
    @IsOptional()
    dataInicio?: Date;

    @ApiPropertyOptional({ description: 'Project end date', example: '2024-12-31' })
    @IsDateString()
    @IsOptional()
    dataTermino?: Date;

    @ApiPropertyOptional({ description: 'Project type', enum: ProjetoTipo, example: ProjetoTipo.BOLSA_IC })
    @IsEnum(ProjetoTipo)
    @IsOptional()
    tipo?: ProjetoTipo;

    @ApiPropertyOptional({ description: 'Project edital URL', example: 'http://example.com/edital.pdf' })
    @IsString()
    @IsOptional()
    edital?: string;
}