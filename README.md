# API de Naves Espaciais

API REST em Node.js com Express e MySQL para gerenciamento de pilotos, naves, planetas e missões.

## Pré-requisitos

- Node.js instalado
- MySQL rodando localmente

## Configuração do Banco de Dados

1. Acesse o MySQL e execute o script SQL:

```bash
mysql -u root -p
```

> A senha padrão configurada é `senacrs`. Se a sua for diferente, edite o arquivo [database/db.js](database/db.js).

> Cole o conteudo do banco.sql

## Instalação

```bash
npm install
```

## Rodando o projeto

```bash
node index.js
```

A API ficará disponível em `http://localhost:3000`.

## Rotas disponíveis

| Recurso    | Base URL      |
|------------|---------------|
| Pilotos    | `/pilotos`    |
| Naves      | `/naves`      |
| Planetas   | `/planetas`   |
| Missões    | `/missoes`    |
