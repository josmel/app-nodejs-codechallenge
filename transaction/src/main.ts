import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_PORT } from './infrastructure/constants';
import { TransactionModule } from './transaction.module';
import { kafkaConfig } from './infrastructure/config/kafka.config';

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Transaction Doc')
    .setDescription('Transaction Doc')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/v1', app, document);
}
async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  app.connectMicroservice(kafkaConfig);

  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(APP_PORT);
}

bootstrap();
