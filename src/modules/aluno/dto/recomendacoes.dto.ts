import { ApiProperty } from "@nestjs/swagger";

export class RecomendacaoProjetoDto {
    @ApiProperty({ description: "Project ID", example: "uuid" })
    id: string;

    @ApiProperty({ description: "Project name", example: "Desenvolvimento de um Sistema de Recomendação" })
    nome: string;

    @ApiProperty({ description: "Project description", example: "Este projeto tem como objetivo..." })
    descricao: string;

    @ApiProperty({ description: "Professor name", example: "João da Silva" })
    professor: string;

    @ApiProperty({ description: "Number of vacancies", example: 2 })
    vagas: number;
}