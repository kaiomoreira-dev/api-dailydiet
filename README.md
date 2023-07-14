<p align="center" style="background-color: black">
  <a href="https://fastify.dev/" target="blank"><img src="https://fastify.dev/img/logos/fastify-white.png" width="400" alt="Fastify Logo" /></a>
</p>

<p align="center">
  <a href="https://fastify.dev/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Fastify_logo.svg" width="400" alt="Fastify Logo" /></a>
</p>

## Intro


## Description


## Requisitos Funcionais(RF)
* [x] Deve ser possível criar um usuário
* [x] Deve ser possível identificar o usuário entre as requisições
* [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    *As refeições devem ser relacionadas a um usuário.*
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
* [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
* [x] Deve ser possível apagar uma refeição
* [x] Deve ser possível listar todas as refeições de um usuário
* [x] Deve ser possível visualizar uma única refeição
* [x] Deve ser possível recuperar as métricas de um usuário
    * [x] Quantidade total de refeições registradas
    * [x] Quantidade total de refeições dentro da dieta
    * [x] Quantidade total de refeições fora da dieta
    * [x] Melhor sequência de refeições dentro da dieta

## Regras de Negócios(RN)
* [x] A transação pode do tipo crédito que somará ao valor total, ou débito que será * subtraído;
* [x] Deve ser possível identificar o usuário entre as requisições;
* [x] O usuário só pode visualizar transações que ele criou;

## Running the app

```bash
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## Fix code
```bash
# fix code with eslint
$ npm run lint
```

## Build
```bash
# build project for JS
$ npm run build
```

# Owner
[<img src="https://avatars.githubusercontent.com/u/56137536?s=400&u=a74073f1d0f605815a4f343436c791ab7b7dc184&v=4" width=115><br><sub>Kaio Moreira</sub>](https://github.com/kaiomoreira-dev)
