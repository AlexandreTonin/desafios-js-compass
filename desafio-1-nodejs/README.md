## Sobre

Este é um servidor HTTP simples criado usando o módulo `http` do Node.js. Ele oferece três endpoints:

- **Health Check**: Um endpoint simples que retorna um JSON indicando que o servidor está funcionando.
- **Is Prime Number**: Um endpoint que verifica se um número é primo. Ele espera um parâmetro de consulta `number` e retorna `true` ou `false` dependendo se o número é primo ou não.
- **Count**: Um endpoint que incrementa um contador com base no valor fornecido no corpo da requisição. O corpo da requisição deve ser um JSON com a chave `incrementBy`.

Cada seção inclui exemplos de como usar `curl` para fazer as requisições e as respostas esperadas. Isso deve ajudar os usuários a entender rapidamente como interagir com a API.

## Como executar o projeto
1. Certifique-se de ter o Node.js e Git instalado.

2. Clone este repositório ou copie o código para o seu ambiente local.

3. Navegue até o diretório do projeto e execute o arquivo server.js, com:
    ```bash
    node server.js
    ```
    ou
    ```bash
    npm run start
    ```
    
4. O servidor estará rodando em http://localhost:3000.

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health-check`

**Exemplo de requisição:**

```bash
curl -X GET http://localhost:3000/health-check
```

**Resposta esperada:**

```bash
{
  "success": true,
  "timeStamp": "2025-03-20T14:27:38.565Z"
}
```

### 2. Is Prime Number

**Endpoint:** `GET /is-prime-number?number=<number>`

**Exemplo de requisição:**

```bash
curl -X GET "http://localhost:3000/is-prime-number?number=29"
```

**Resposta esperada:**

```bash
{
  "isPrime": true
}
```

Exemplo de requisição com entrada inválida:

```bash
curl -X GET "http://localhost:3000/is-prime-number?number=abc"
```

**Resposta esperada:**

```bash
{
  "error": "Invalid input"
}
```

### 3. Count

**Endpoint:** `POST /count`

**Exemplo de requisição:**

```bash
curl -X POST http://localhost:3000/count \
-H "Content-Type: application/json" \
-d '{"incrementBy": 5}'
```

**Resposta esperada:**

```bash
{
  "counter": 5
}
```

Exemplo de requisição com entrada inválida:
```bash
curl -X POST http://localhost:3000/count \
-H "Content-Type: application/json" \
-d '{"incrementBy": "abc"}
```

**Resposta esperada:**

```bash
{
  "error": "Invalid input"
}
```
