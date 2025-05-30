import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjetoStatus, ProjetoTipo } from '@prisma/client';

export class CreateProjetoDto {
    @ApiProperty({ description: 'Project name', example: 'Desenvolvimento de um Sistema de Recomendação' })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({ description: 'Project description', example: 'Este projeto tem como objetivo...' })
    @IsString()
    @IsNotEmpty()
    descricao: string;

    @ApiProperty({ description: 'Professor ID', example: 'uuid' })
    @IsUUID()
    professorId: string;

    @ApiProperty({ description: 'Project requirements', example: 'Conhecimento em Python e Machine Learning' })
    @IsString()
    @IsNotEmpty()
    requisitos: string;

    @ApiProperty({ description: 'Number of vacancies', example: 2 })
    @IsNumber()
    vagas: number;

    @ApiPropertyOptional({ description: 'Project scholarship value', example: 400.00 })
    @IsNumber()
    @IsOptional()
    bolsa?: number;

    @ApiProperty({ description: 'Project start date', example: '2024-01-01' })
    @IsDateString()
    dataInicio: Date;

    @ApiProperty({ description: 'Project end date', example: '2024-12-31' })
    @IsDateString()
    dataTermino: Date;

    @ApiProperty({ description: 'Project type', enum: ProjetoTipo, example: ProjetoTipo.BOLSA_IC })
    @IsEnum(ProjetoTipo)
    tipo: ProjetoTipo;

    @ApiPropertyOptional({ description: 'Project edital URL', example: 'http://example.com/edital.pdf' })
    @IsString()
    @IsOptional()
    edital?: string;
}