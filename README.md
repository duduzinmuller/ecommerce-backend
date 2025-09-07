# Ecommerce Backend API

Este projeto é uma **API de Ecommerce** desenvolvida em Node.js com TypeScript, utilizando arquitetura modular e integração com o gateway de pagamentos [Asaas](https://www.asaas.com/). O sistema oferece funcionalidades completas para gerenciamento de usuários, produtos, categorias, carrinho de compras, pedidos, pagamentos e notificações por e-mail.

## Principais Funcionalidades

- Cadastro, autenticação e gerenciamento de usuários
- CRUD de produtos e categorias
- Carrinho de compras e itens do carrinho
- Criação e gerenciamento de pedidos
- Integração com o gateway de pagamento Asaas (boleto, pix, cartão de crédito)
- Notificações por e-mail
- Documentação automática via Swagger
- **Validação de dados com Zod** em todas as entradas de API

## Tecnologias Utilizadas

- Node.js + TypeScript
- Express.js
- Drizzle ORM
- JWT para autenticação
- **Zod para validação de dados**
- Integração com Asaas para pagamentos
- Swagger para documentação

## Instalação

```sh
git clone https://github.com/seu-usuario/ecommerce-backend.git
cd ecommerce-backend
pnpm install
cp .env.example .env
# Configure as variáveis de ambiente no arquivo .env
pnpm run build
pnpm run dev
```

## Documentação da API

Acesse a documentação interativa em:  
`/docs`  
Exemplo: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Exemplos de Rotas

### Usuários

- **Criar usuário**
  ```
  POST /api/users
  Body: { "name": "...", "email": "...", "password": "..." }
  ```
- **Login**
  ```
  POST /api/users/login
  Body: { "email": "...", "password": "..." }
  ```
- **Buscar usuário logado**
  ```
  GET /api/users/me
  Headers: Authorization: Bearer {token}
  ```

### Categorias

- **Criar categoria**
  ```
  POST /api/categories
  Body: { "name": "...", "slug": "..." }
  ```
- **Listar categorias**
  ```
  GET /api/categories
  ```
- **Buscar categoria por slug**
  ```
  GET /api/categories/slug/:slug
  ```

### Produtos

- **Criar produto**
  ```
  POST /api/products
  Body: { "name": "...", "slug": "...", "description": "...", ... }
  ```
- **Listar produtos**
  ```
  GET /api/products
  ```
- **Buscar produto por slug**
  ```
  GET /api/products/slug/:slug
  ```
- **Buscar produto por nome**
  ```
  GET /api/products/search?productName=...
  ```

### Carrinho

- **Criar carrinho**
  ```
  POST /api/carts
  Headers: Authorization: Bearer {token}
  ```
- **Buscar carrinho do usuário**
  ```
  GET /api/carts/me
  Headers: Authorization: Bearer {token}
  ```

### Itens do Carrinho

- **Adicionar item ao carrinho**
  ```
  POST /api/cart-items
  Body: { "cart_id": "...", "product_id": "...", "quantity": ... }
  Headers: Authorization: Bearer {token}
  ```
- **Listar itens do carrinho**
  ```
  GET /api/cart-items/cart/:cartId
  Headers: Authorization: Bearer {token}
  ```
- **Atualizar quantidade de item**
  ```
  PATCH /api/cart-items/:itemId
  Body: { "quantity": ... }
  Headers: Authorization: Bearer {token}
  ```
- **Remover item do carrinho**
  ```
  DELETE /api/cart-items/:itemId
  Headers: Authorization: Bearer {token}
  ```

### Pedidos

- **Criar pedido**
  ```
  POST /api/orders
  Headers: Authorization: Bearer {token}
  Body: { ...dados de entrega... }
  ```
- **Buscar pedidos do usuário**
  ```
  GET /api/orders/me
  Headers: Authorization: Bearer {token}
  ```
- **Atualizar pedido**
  ```
  PATCH /api/orders/:orderId
  Headers: Authorization: Bearer {token}
  Body: { ... }
  ```
- **Deletar pedido**
  ```
  DELETE /api/orders/:orderId
  Headers: Authorization: Bearer {token}
  ```

### Pagamentos

- **Criar pagamento**
  ```
  POST /api/payments
  Headers: Authorization: Bearer {token}
  Body: { "order_id": "...", "method": "pix|boleto|credit_card", ... }
  ```

---

## Integração com Asaas

A API está integrada ao Asaas para geração de cobranças via boleto, pix e cartão de crédito. Certifique-se de configurar as credenciais do Asaas no arquivo `.env`.

---

---

## 📁 Estrutura de Pastas (`/src`)

```
src/
├── adapters/           # Adapta funcionalidades externas como geração de IDs, hash de senhas, comparação de senhas e manipulação de tokens JWT..
├── config/             # Configurações de serviços externos, como Asaas e envio de e-mails.
├── controller/         # Lógica dos endpoints da API, organizados por domínio (usuários, produtos, pedidos, etc).
├── db/                 # Configuração do banco de dados, schema, e scripts de seed.
├── errors/             # Definições de erros customizados para cada domínio da aplicação.
├── factories/          # Funções para instanciar e compor casos de uso, repositórios e controladores.
├── interfaces/         # Tipagens TypeScript para entidades, DTOs, requests e responses.
├── middleware/         # Middlewares do Express, como autenticação JWT.
├── repositories/       # Implementação de acesso a dados (CRUD) para cada domínio, incluindo integração com Asaas.
├── routes/             # Definição das rotas HTTP da API, agrupadas por domínio.
├── schemas/            # Schemas de validação Zod para cada entidade e request da API, garantindo segurança e integridade dos dados recebidos.
├── use-cases/          # Lógica de negócio (application services) para cada funcionalidade do sistema.
├── utils/              # Funções utilitárias diversas, como manipulação de documentos, valores monetários e estados.
├── app.ts              # Configuração principal do Express
└── index.ts            # Ponto de entrada do servidor
```

---


## Scripts

- `pnpm run dev` — Inicia o servidor em modo desenvolvimento
- `pnpm run build` — Compila o projeto
- `pnpm run start` — Inicia o servidor em produção

---

## Licença

MIT

---

> Projeto desenvolvido para fins de estudo e demonstração de arquitetura de APIs modernas
