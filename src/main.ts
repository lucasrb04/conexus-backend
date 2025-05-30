import 'dotenv/config'; // Carregar as variáveis de ambiente
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  const config = new DocumentBuilder()
    .setTitle('University Projects API')
    .setDescription('API for managing university projects')
    .setVersion('1.0')
    .addTag('projects')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // Nome do esquema de segurança
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ bearerAuth: [] }];

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {},
    customSiteTitle: 'API Documentation',
  });

  await app.listen(3001);
}
bootstrap();
