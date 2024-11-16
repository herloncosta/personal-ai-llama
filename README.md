# Personal AI Streaming API

Este projeto é um servidor Express simples que utiliza uma API de IA para gerar respostas baseadas em um *prompt*. A aplicação envia uma requisição para uma API de IA (localizada em `http://localhost:11434/api/generate`) e recebe a resposta em formato de **streaming**, que é então enviada de volta ao cliente.

## Funcionalidade

- O servidor **Express** expõe um endpoint **POST** `/ai`.
- O corpo da requisição deve conter um campo `prompt`, que será enviado à API de IA.
- A API de IA (no exemplo, rodando localmente em `http://localhost:11434/api/generate`) processa o *prompt* e retorna a resposta como um **stream**.
- O servidor envia a resposta de volta ao cliente em tempo real, conforme os dados são gerados pela IA.

## Pré-requisitos

Antes de rodar o projeto, você precisa ter as seguintes dependências instaladas:

- **Node.js** (v14.x ou superior)
- **pnpm**, **NPM** ou **Yarn** (gerenciador de pacotes)
- **Ollama** `https://ollama.com/library/llama3.2`, a ser acessada pela URL `http://localhost:11434/api/generate`

## Instalação

1. Clone o repositório para o seu ambiente local:

   ```bash
   git clone https://github.com/username/personal-ai-streaming.git
   cd personal-ai-streaming
   ```

2. Instale as dependências do projeto:

    Usando **pnpm**:

   ```bash
   pnpm install
   ```
Lembrando que estou utilizando o **pnpm** como gerenciador de pacotes, mas você pode usar o **NPM** ou **Yarn** se preferir.

3. Certifique-se de que a API de IA está rodando em `http://localhost:11434/api/generate`.

## Como rodar o servidor

Para iniciar o servidor Express, execute o seguinte comando:

```bash
pnpm start
```

O servidor estará rodando em **http://localhost:3000**.

## Como usar

### Enviando uma requisição

Você pode enviar uma requisição para o endpoint `/ai` usando uma ferramenta como **Postman** ou **cURL**.

#### Exemplo de requisição com **cURL**:

```bash
curl -X POST http://localhost:3000/ai \
-H "Content-Type: application/json" \
-d '{"prompt": "Qual a capital do Brasil?"}'
```

#### Exemplo de requisição com **Postman**:

- Método: **POST**
- URL: `http://localhost:3000/ai`
- Corpo da requisição (raw, tipo JSON):

```json
{
  "prompt": "Qual a capital do Brasil?"
}
```

### Como funciona

- O servidor Express recebe o *prompt* no corpo da requisição.
- Ele então envia uma requisição **POST** para a API de IA (`http://localhost:11434/api/generate`) com o modelo e o prompt.
- A resposta da IA é transmitida como um **stream** e os dados são enviados de volta ao cliente conforme a IA gera a resposta.
- A resposta é enviada ao cliente em **chunks** (pedaços de dados) usando `res.json({ chunk })`.

### Exemplo de Resposta

A resposta para a requisição pode ser algo como:

```json
{
  "chunk": "A capital do Brasil é Brasília."
}
```

Este processo ocorre enquanto a IA gera os dados, permitindo que o cliente receba a resposta em tempo real.

## Tratamento de Erros

Se ocorrer um erro ao chamar a API de IA ou se a requisição falhar, a resposta será um código **404** com a mensagem de erro:

```json
{
  "error": "Mensagem de erro"
}
```

## Estrutura do Projeto

- `index.js`: Arquivo principal que configura o servidor Express, lida com as rotas e faz a requisição para a API de IA.
- `package.json`: Arquivo de configuração do NPM/Yarn, contendo as dependências e scripts do projeto.

## Dependências

- `express`: Framework minimalista para Node.js.
- `axios`: Cliente HTTP para fazer requisições à API de IA.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.