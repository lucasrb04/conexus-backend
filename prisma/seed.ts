import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Limpar dados existentes
    await prisma.inscricao.deleteMany({});
    await prisma.cursosProjetos.deleteMany({});
    await prisma.projeto.deleteMany({});
    await prisma.aluno.deleteMany({});
    await prisma.professor.deleteMany({});
    await prisma.curso.deleteMany({});

    // Criar cursos
    const cursos = [
        { nome: 'Engenharia de Computação' },
        { nome: 'Sistemas de Informação' },
        { nome: 'Ciência da Computação' },
        { nome: 'Engenharia Elétrica' },
        { nome: 'Matemática' },
        { nome: 'Física' },
    ];

    const createdCourses = await Promise.all(
        cursos.map((curso) => prisma.curso.create({ data: curso }))
    );

    // Criar professores
    const professoresData = Array.from({ length: 5 }).map((professor) => {
        const senha = 'senha123'; // Senha padrão
        return bcrypt.hash(senha, 10).then(hashedPassword => ({ // Hashear a senha
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            senha: hashedPassword, // Usar a senha hasheada
            departamento: faker.science.chemicalElement().name + ' Department',
        }));
    });

    const professores = await Promise.all(
        professoresData.map(async (professorData) => prisma.professor.create({ data: await professorData }))
    );

    // Criar alunos
    const alunosData = Array.from({ length: 20 }).map((aluno) => {
        const senha = 'senha123'; // Senha padrão
        return bcrypt.hash(senha, 10).then(hashedPassword => ({ // Hashear a senha
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            senha: hashedPassword, // Usar a senha hasheada
            cursoId: faker.helpers.arrayElement(createdCourses).id,
            periodo: faker.number.int({ min: 1, max: 10 }),
        }));
    });

    const alunos = await Promise.all(
        alunosData.map(async (alunoData) => prisma.aluno.create({ data: await alunoData }))
    );

    // Criar projetos
    const projetosData = Array.from({ length: 10 }).map(() => ({
        nome: faker.lorem.sentence(),
        descricao: faker.lorem.paragraph(),
        professorId: faker.helpers.arrayElement(professores).id,
        requisitos: faker.lorem.sentence(),
        vagas: faker.number.int({ min: 1, max: 5 }),
        bolsa: faker.number.float({ min: 300, max: 1000 }),
        dataInicio: faker.date.past(),
        dataTermino: faker.date.future(),
        tipo: faker.helpers.arrayElement(['BOLSA_IC', 'ESTAGIO', 'MONITORIA', 'TRABALHO_VOLUNTARIO']),
        status: faker.helpers.arrayElement(['ABERTO', 'FECHADO', 'EM_ANDAMENTO', 'CONCLUIDO']),
        edital: faker.internet.url(),
        cursosProjetos: {
            create: faker.helpers
                .arrayElements(createdCourses, faker.number.int({ min: 1, max: createdCourses.length }))
                .map((curso) => ({ cursoId: curso.id })),
        },
    }));

    const projetos = await Promise.all(
        projetosData.map((projeto) => prisma.projeto.create({ data: projeto }))
    );

    // Criar Inscrições
    const inscricoesData = Array.from({ length: 30 }).map(() => ({
        alunoId: faker.helpers.arrayElement(alunos).id,
        projetoId: faker.helpers.arrayElement(projetos).id,
        status: faker.helpers.arrayElement(['PENDENTE', 'APROVADA', 'REPROVADA']),
        dataInscricao: faker.date.past(),
        mensagem: faker.lorem.sentence(),
    }));

    await prisma.inscricao.createMany({
        data: inscricoesData,
    });

    console.log('Banco de dados populado com sucesso!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });