import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AntiFraudModule } from './anti-fraud.module';
import { kafkaConfig } from './infrastructure/config/kafka.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    kafkaConfig,
  );

  app.useGlobalPipes(new ValidationPipe());

  app.listen();

  console.log('Kafka Anti-Fraud Microservice is listening');

  app.enableShutdownHooks();
}

bootstrap();
