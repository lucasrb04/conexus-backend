import { ApiProperty } from "@nestjs/swagger";

export class AlunoEstatisticasDto {
    @ApiProperty({ description: "Total number of applications", example: 10 })
    totalCandidaturas: number;

    @ApiProperty({ description: "Number of active projects", example: 2 })
    projetosAtivos: number;

    @ApiProperty({ description: "Number of completed projects", example: 5 })
    projetosConcluidos: number;

    @ApiProperty({ description: "Number of approved applications", example: 7 })
    candidaturasAprovadas: number;

    @ApiProperty({ description: "Number of rejected applications", example: 3 })
    candidaturasReprovadas: number;

    @ApiProperty({ description: "Tempo médio de espera para aprovação", example: 10 })
    tempoMedioEspera: number
}