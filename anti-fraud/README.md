## Description Microservice anti-fraud

## Anti-Fraud Microservice

Este microservicio está diseñado para detectar y manejar transacciones fraudulentas en tiempo real. Se basa en el framework [Nest](https://github.com/nestjs/nest) utilizando Kafka para la comunicación entre microservicios y MongoDB para persistir las transacciones.

## Descripción

El Microservicio Anti-Fraude consume transacciones desde un tópico de Kafka y valida el estado de cada transacción basándose en reglas predefinidas. Si la transacción supera ciertos límites, se marca como fraudulenta, y se publica el resultado en otro tópico de Kafka para su procesamiento.

## Installation

```bash
$ cp .env.example  .env
```

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints y API

Este microservicio no expone directamente endpoints HTTP, ya que se comunica a través de Kafka con otros microservicios. A continuación se detallan los principales tópicos utilizados:

- **TOPIC_KAFKA_SEND_TRANSACTION**: Tópico para recibir transacciones a validar.
- **TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION**: Tópico para enviar el resultado del proceso de validación.

## Tecnologías utilizadas

- **NestJS**: Framework para construir aplicaciones Node.js escalables.
- **Kafka**: Plataforma de transmisión distribuida para manejar los mensajes entre microservicios.
- **MongoDB**: Base de datos NoSQL para almacenar las transacciones.
