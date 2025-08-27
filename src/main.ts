import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logger (Winston)
  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Base Project Nest')
    .setDescription('Base Project API Description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
