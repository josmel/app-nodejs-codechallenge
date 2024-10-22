## Description Microservice transaction

# Microservicio de Transacciones

Este microservicio es responsable de gestionar las transacciones financieras dentro del sistema. Se comunica a través de Kafka con otros microservicios y utiliza MongoDB como base de datos para almacenar la información de las transacciones.

## Descripción

El microservicio de transacciones procesa las transacciones enviadas por los usuarios y las valida. Se comunica con el microservicio anti-fraude para determinar el estado de la transacción (aprobada, rechazada o pendiente).

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

## APis

```http
POST /api/v1/create-transaction
```

```body
{
  "accountExternalIdDebit": "string",
  "accountExternalIdCredit": "string",
  "tranferTypeId": number,
  "value": number
}
```

## Responses

```javascript
{
    "transactionExternalId": "6333805fb6e7b7a36fd3390f",
    "transactionStatus": {
        "name": "pending"
    },
    "tranferType": {
        "name": "visa"
    },
    "createdAt": "2022-09-27T22:59:43.881Z",
    "value": 444444
}
```

```http
GET /api/v1/get-transaction/6333805fb6e7b7a36fd3390f
```

## Responses

```javascript
{
    "transactionExternalId": "6333805fb6e7b7a36fd3390f",
    "transactionStatus": {
        "name": "rejected"
    },
    "tranferType": {
        "name": "visa"
    },
    "createdAt": "2022-09-27T22:23:08.113Z",
    "value": 999
}
```

# Documentation in swagger

```bash
http://localhost:3060/api/v1
```

## Endpoints y API

A continuación se detallan los principales tópicos utilizados:

- **TOPIC_KAFKA_SEND_TRANSACTION**: Tópico para recibir transacciones a validar.
- **TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION**: Tópico para enviar el resultado del proceso de validación.

## Tecnologías utilizadas

- **NestJS**: Framework para construir aplicaciones Node.js escalables.
- **Kafka**: Plataforma de transmisión distribuida para manejar los mensajes entre microservicios.
- **MongoDB**: Base de datos NoSQL para almacenar las transacciones.
