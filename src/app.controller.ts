import { Controller, Get, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './modules/auth/public.decorator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function generatePostmanCollection() {
  const app = await NestFactory.create(AppModule);

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
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Extrair informações relevantes do documento Swagger
  const collection = {
    info: {
      name: 'University Projects API',
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [],
  };

  for (const path in document.paths) {
    for (const method in document.paths[path]) {
      const operation = document.paths[path][method];
      let requestBodySchema = {};

      if (
        operation.requestBody &&
        operation.requestBody.content &&
        operation.requestBody.content['application/json']
      ) {
        const schema = operation.requestBody.content['application/json'].schema;
        if (schema['$ref']) {
          const schemaName = schema['$ref'].split('/').pop();
          requestBodySchema = document.components.schemas[schemaName];
        } else {
          requestBodySchema = schema;
        }
      }

      const request = {
        name: operation.summary || path,
        request: {
          url: `{{baseUrl}}${path}`,
          method: method.toUpperCase(),
          header: [],
          body: {
            mode: 'raw',
            raw: JSON.stringify(requestBodySchema),
            options: {
              raw: {
                language: 'json',
              },
            },
          },
          description: operation.description,
        },
        response: [],
      };

      // Adicionar cabeçalho de autorização se a rota for protegida
      if (operation.security && operation.security.length > 0) {
        request.request.header.push({
          key: 'Authorization',
          value: 'Bearer {{token}}',
          type: 'text',
          description: 'JWT token',
        });
      }

      collection.item.push(request);
    }
  }

  // Função auxiliar para resolver referências de schema
  function resolveReferences(obj, components) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (obj['$ref']) {
      const refPath = obj['$ref'].split('/').slice(1);
      let resolved = components;
      for (const segment of refPath) {
        resolved = resolved[segment];
      }
      return resolved;
    }

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = resolveReferences(obj[key], components);
      }
    }

    return obj;
  }

  // Resolver todas as referências antes de salvar
  const resolvedCollection = resolveReferences(collection, document.components);

  // Salvar a collection em um arquivo JSON
  fs.writeFileSync(
    'university-projects-api.postman_collection.json',
    JSON.stringify(resolvedCollection, null, 2),
  );

  console.log('Postman collection generated successfully!');
  await app.close();
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @Header('Content-Type', 'application/json')
  async getPostmanCollection(
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    console.log('gerando collection');
    return generatePostmanCollection();
  }
}
