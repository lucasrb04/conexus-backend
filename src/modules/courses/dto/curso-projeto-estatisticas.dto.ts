import { ApiProperty } from '@nestjs/swagger';

export class CourseProjetosEstatisticasDto {
  @ApiProperty({ description: 'Course ID', example: 'uuid' })
  cursoId: string;

  @ApiProperty({
    description: 'Course name',
    example: 'Engenharia de Computação',
  })
  cursoNome: string;

  @ApiProperty({ description: 'Number of projects', example: 15 })
  numeroProjetos: number;
}
