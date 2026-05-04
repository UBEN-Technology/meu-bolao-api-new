# Meu Bolão — API

API REST do **Meu Bolão**, uma plataforma de bolões esportivos com tema dark "Stadium Pulse" (inspirado no Betano).

## 🚀 Tecnologias

- **Fastify 5** — Framework web rápido e eficiente
- **TypeScript** — Tipagem estática
- **Knex.js** — Query builder SQL
- **MySQL 8.0** — Banco de dados relacional
- **JWT** — Autenticação via tokens
- **bcryptjs** — Hash de senhas
- **Zod** — Validação de schemas

## 📋 Pré-requisitos

- Node.js v24+ (gerenciado via nvm)
- Yarn
- MySQL 8.0 (via Docker recomendado)
- Docker Desktop (se estiver no WSL2)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repo>
cd meu-bolao-api
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure o banco de dados (MySQL via Docker)

```bash
# Crie o container MySQL
docker run -d \
  --name meu-bolao-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=meu_bolao_db \
  -p 3306:3306 \
  mysql:8.0

# Aguarde o MySQL inicializar (≈ 30 segundos)
sleep 30

# Execute o schema e os seeds
docker exec -i meu-bolao-mysql mysql -uroot -proot meu_bolao_db < schema.sql
docker exec -i meu-bolao-mysql mysql -uroot -proot meu_bolao_db < seeds.sql
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
JWT_SECRET=meu-bolao-secret-key

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=meu_bolao_db

# Pontuação
EXACT_RESULT_POINTS=10
WINNER_AND_GOAL_DIFFERENCE_POINTS=7
WINNER_ONLY_POINTS=5
ONE_TEAM_GOALS_POINTS=2
TOTAL_PRIZE=100
```

### 5. Inicie o servidor

```bash
yarn dev
```

A API estará disponível em `http://localhost:3333`.

## 🧪 Testes E2E (Playwright)

O frontend possui testes E2E que dependem desta API. Para executá-los:

1. Certifique-se de que a API está rodando
2. No projeto web, execute: `npx playwright test`

**⚠️ Atenção:** O endpoint `/auth/login` possui rate limit de 5 requisições a cada 15 minutos. Para testes repetidos, reinicie o servidor da API para limpar o rate limit em memória.

## 📁 Estrutura do Projeto

```
src/
├── application/        # Casos de uso e schemas
├── domain/             # Entidades e regras de negócio
├── infrastructure/
│   ├── database/       # Knex, migrations, repositórios
│   ├── http/           # Rotas, controllers, middlewares
│   └── services/       # Serviços mock (OneFootball, Pagar.me, Email)
└── utils/              # Utilitários
```

## 🔐 Autenticação

- Login retorna `{ user, accessToken, refreshToken }`
- O `accessToken` deve ser enviado no header `Authorization: Bearer <token>`
- Refresh token é usado no endpoint `POST /auth/refresh`
- Logout adiciona o token à blacklist

## 👤 Usuários Seed

| Email | Senha | Admin |
|-------|-------|-------|
| `admin@meubolao.com` | `admin123` | ✅ |
| `joao@email.com` | `admin123` | ❌ |
| `maria@email.com` | `admin123` | ❌ |
| `pedro@email.com` | `admin123` | ❌ |

## 🐳 Docker (MySQL)

```bash
# Iniciar
docker start meu-bolao-mysql

# Parar
docker stop meu-bolao-mysql

# Resetar banco (apaga tudo e recria)
docker exec -i meu-bolao-mysql mysql -uroot -proot meu_bolao_db < schema.sql
docker exec -i meu-bolao-mysql mysql -uroot -proot meu_bolao_db < seeds.sql
```

## 📝 Licença

MIT
