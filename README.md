# Mini Controle de Fabrica de Software

Aplicacao web para controle de clientes, projetos, lancamentos de horas e dashboard de lucratividade.

---

## Checklist rapido de apresentacao

1) Backend no ar: http://localhost:8000/api/clientes
2) Front no ar: http://localhost:5173
3) Demonstre:
   - Clientes (CRUD + busca)
   - Projetos (CRUD + status)
   - Lancamentos (filtro por projeto/periodo)
   - Dashboard (cards + grafico + CSV)

---

## Stack
- Backend: Laravel (API REST)
- Frontend: React + Vite
- Banco: MySQL (ou SQLite para demo rapida)

---

## Funcionalidades (escopo do desafio)

### CRUD 1 - Clientes
Campos: id, nome, email (unico), telefone, ativo, created_at, updated_at
- Busca por nome/email

### CRUD 2 - Projetos
Campos: id, cliente_id, nome, descricao, data_inicio, data_fim, valor_contrato, custo_hora_base, status
- Projeto pertence a Cliente
- valor_contrato > 0, custo_hora_base > 0

### CRUD 3 - Lancamentos (Timesheet)
Campos: id, projeto_id, colaborador, data, horas, tipo, descricao
- horas > 0
- filtro por projeto e periodo

### Dashboard de Lucratividade
- horas totais, custo total, receita, margem, margem %, break-even
- resumo por tipo (corretiva/evolutiva/implantacao/legislativa)
- grafico e exportacao CSV

---

## Como rodar (Windows ou Linux)

### Opcao A - Docker (mais simples)
Requisito: Docker instalado.

1) Subir containers:
```bash
docker-compose up -d --build
```

2) Rodar migrations:
```bash
docker-compose exec backend php artisan migrate --seed
```

3) Subir frontend local:
```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:8000/api

---

### Opcao B - Local com MySQL
Requisitos: PHP 8.2+, Composer, Node, MySQL.

Backend:
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend:
```bash
npm install
npm run dev
```

---

### Opcao C - Local com SQLite (mais rapido para demo)

1) Crie o arquivo do banco:
```bash
touch backend/database/database.sqlite
```

2) Configure no .env:
```
DB_CONNECTION=sqlite
DB_DATABASE=/caminho/absoluto/para/backend/database/database.sqlite
```

3) Rode:
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## Endpoints principais
- GET /api/clientes?busca=...
- POST /api/clientes
- GET /api/projetos
- POST /api/projetos
- GET /api/lancamentos?projeto_id=1&inicio=YYYY-MM-DD&fim=YYYY-MM-DD
- POST /api/lancamentos
- GET /api/projetos/{id}/dashboard?inicio=YYYY-MM-DD&fim=YYYY-MM-DD

---

## Deploy (opcional)

### Backend no Railway
1) Root Directory = backend
2) Build Command = composer install
3) Start Command = php artisan serve --host=0.0.0.0 --port=$PORT
4) Configure variaveis APP_* e DB_*

### Frontend no GitHub Pages
1) base no vite.config.js = /NOME-REPO/
2) baseURL no src/services/api.js = URL do Railway
3) npm run build (pasta docs)

---

## Seed
O comando php artisan migrate --seed cria dados de exemplo...
 