# API Mini Banco Central

Esta API simula um sistema bancário aberto simplificado, permitindo operações básicas como criação de contas, transações, consulta de saldo e extrato.

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL
- Docker

## 📁 Estrutura da API

Este projeto segue uma arquitetura inspirada na **Clean Architecture** e princípios de Domain-Driven Design com separação clara de responsabilidades entre domínio, infraestrutura, camada HTTP e módulos compartilhados.

<pre>
src/                          # Pasta principal do código-fonte
├── domain/                   # Contém a lógica de negócio pura (core da aplicação)
│   ├── entities/             # Entidades do domínio (modelos centrais, sem dependências externas)
│   ├── repositories/         # Interfaces para repositórios (contratos para acesso a dados)
│   └── services/             # Casos de uso e regras de negócio implementadas
│
├── http/                     # Camada de interface HTTP (entrada do sistema)
│   ├── controllers/          # Controladores que lidam com requisições e respostas
│   └── routes/               # Arquivos de definição de rotas/endpoints
│
├── infra/                    # Implementações concretas da infraestrutura
│   ├── db/                   # Código de persistência (ex: conexão com banco, queries)
│   └── logger/               # Configuração e uso de sistema de logs
│
├── shared/                   # Módulos utilitários e compartilhados
│   └── config/               # Configurações globais (ex: variáveis de ambiente, setup de libs)
│
├── server.js                 # Inicialização do servidor
│
└── app.js                    # Ponto de entrada da aplicação (configurações, rotas, etc.)
</pre>

## 📋 Pré-requisitos

- Node.js (versão 20 ou superior)
- Docker
- Npm

## 🔧 Instalação

1. Clone o repositório
   ```bash
   git clone https://github.com/alexandretonin/
   ```
   
2. Navegue até o diretório do projeto:
   ```bash
   cd api-mini-banco-central
   ```

3. Configure as variáveis de ambiente no arquivo ```.env``` (SERVER_PORT e DATABASE_URL)
   - <mark>obs: a variável DATABASE_URL já está preparado no container da API no docker. Só seria necessário configurar, caso fosse rodar a API fora do docker.</mark>
   <br>
   
   ```bash
   echo -e "SERVER_PORT=3000\nDATABASE_URL=postgresql://database_user:database_password@localhost:5432/mbc" > .env
   ```

4. Inicie os containers Docker (API e Postgres):
   ```bash
   docker compose --env-file .env up --build -d
   ```
   
5. Verifique se a API está rodando:
   ```bash
   curl -X GET http://localhost:3000/
   ```
   
## 📚 Documentação da API

### Endpoints

#### Instituições

<hr></hr>

##### Criar Instituição
```POST``` /instituicoes


Request Body:
```json
{
  "name": "Sicredi",
}
```

Response Body:
```json
{
    "success": true,
    "message": "Instituição criada com sucesso",
    "data": {
        "id": ID,
        "name": "Sicredi",
        "created_at": TIMESTAMP
    }
}
```

Exemplo com curl:
```bash
curl -X POST http://localhost:3000/instituicoes \
  -H "Content-Type: application/json" \
  -d '{"name": "Sicredi"}'
```

#### Usuários

<hr></hr>

##### Criar Conta

```POST``` /usuarios/:id/contas


Request Body:
```json
{
    "institutionId": 2
}
```

Response Body:
```json
{
    "success": true,
    "message": "Account created successfull",
    "data": {
        "id": ID,
        "user_id": USER_ID,
        "institution_id": INSTITUION_ID,
        "balance": "0.00",
        "created_at": TIMESTAMP
    }
}
```

Exemplo com curl:
```bash
curl -X POST http://localhost:3000/usuarios/1/contas \
  -H "Content-Type: application/json" \
  -d '{"institutionId": 1}'
```

<hr></hr>

##### Realizar Transação

```POST``` /usuarios/:id/transacoes


Request Body:
```json
{
    "fromAccountId": 1,
    "toAccountId": 2,
    "amount": 500,
    "description": "Quitar dívidas"
}
```

Response Body:
```json
{
    "success": true,
    "data": {
        "id": ID,
        "from_account_id": 1,
        "to_account_id": 2,
        "transaction_type": "transfer",
        "amount": "500",
        "description": "Quitar dívidas",
        "status": "completed",
        "created_at": TIMESTAMP
    }
}
```

Exemplo com curl:
```bash
curl -X POST http://localhost:3000/usuarios/1/transacoes \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId": 1, "toAccountId": 2, "amount": 500, "description": "Quitar dívidas"}'
```

<hr></hr>

##### Consultar Saldo

```GET``` ```GET``` ```/usuarios/:id/saldo``` ou com query param ```/usuarios/:id/saldo?instituicao=nubank```

Response Body
```json
{
  "success": true,
  "data": {
    "total_balance": "500.00",
    "accounts": [
      {
        "institution": "Nubank",
        "balance": "500.00"
      },
      {
        "institution": "Banco do Brasil",
        "balance": "0.00"
      },
      {
        "institution": "Itaú",
        "balance": "0.00"
      }
    ]
  }
}
```

Exemplo com curl:
```bash
curl -X GET http://localhost:3000/usuarios/1/saldo
```
<hr></hr>

##### Consultar Extrato

```GET``` ```/usuarios/:id/extrato``` ou com query param ```/usuarios/:id/extrato?instituicao=nubank```

Response Body
```json
{
  "success": true,
  "data": {
    "received_amount": 75,
    "sent_amount": 701,
    "statement": [
      {
        "id": 1,
        "from_account_id": 1,
        "to_account_id": 2,
        "transaction_type": "transfer",
        "amount": "200.00",
        "description": "João transferiu para Maria",
        "status": "completed",
        "created_at": "2025-04-09T14:32:42.419Z",
        "from_user_id": 1,
        "to_user_id": 2,
        "from_institution": "Nubank",
        "to_institution": "Banco do Brasil",
        "sent_amount": "200.00",
        "received_amount": "0"
      },
    ]
  }
}
```

Exemplo com curl:
```bash
curl -X GET http://localhost:3000/usuarios/1/extrato
```
