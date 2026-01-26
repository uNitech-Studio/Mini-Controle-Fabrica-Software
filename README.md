# Mini Controle de Fabrica de Software

Aplicacao web para controle de clientes, projetos, lancamentos de horas e dashboard de lucratividade.

## Stack

- Backend: Laravel (API REST)
- Frontend: React + Vite
- Banco: MySQL

## Como subir com Docker Compose

1) Copie o arquivo de ambiente do backend:

```bash
copy backend\.env.example backend\.env
```

2) Suba os containers:

```bash
docker compose up -d --build
```

3) Instale dependencias e prepare o Laravel:

```bash
docker compose exec backend composer install
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
```

4) Suba o frontend localmente:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
API: `http://localhost:8000/api`

## Rodar sem Docker (opcional)

1) Configure MySQL local e ajuste `backend/.env` com suas credenciais.  
2) No backend:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

3) No frontend:

```bash
npm install
npm run dev
```

## Endpoints principais

- `GET /api/clientes?busca=...`
- `POST /api/clientes`
- `GET /api/projetos`
- `POST /api/projetos`
- `GET /api/lancamentos?projeto_id=1&inicio=YYYY-MM-DD&fim=YYYY-MM-DD`
- `POST /api/lancamentos`
- `GET /api/projetos/{id}/dashboard?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`

## Seed

O comando `php artisan migrate --seed` cria clientes, projetos e lancamentos exemplo.

## Variaveis de ambiente (backend)

Veja `backend/.env.example` para MySQL (host `mysql`, porta `3306`).
