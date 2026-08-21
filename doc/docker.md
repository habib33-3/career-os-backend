## Docker Development Setup

### 1. Configure environment variables

Copy the demo environment file:

```bash
cp .env.demo .env
```

Configure `.env.docker` with the Docker service names:

```env
DATABASE_URL=postgresql://postgres:password@db:5432/career_os
REDIS_URL=redis://redis:6379
```

You also need to configure **Resend** and **Cloudinary** yourself in `.env.docker`.

Add your own credentials for:

- Resend API key
- Cloudinary cloud name
- Cloudinary API key
- Cloudinary API secret

> **Important:** Use `db` and `redis` instead of `localhost` in `.env.docker`. These are the Docker Compose service names and are accessible from the backend container.

### 2. Start Docker services

Build the application image and start all services:

```bash
docker compose up -d --build
```

Check that all services are running:

```bash
docker compose ps
```

### 3. Generate Prisma Client

Generate the Prisma Client inside the backend container:

```bash
docker exec -it career-os-backend pnpm prisma generate
```

### 4. Run database migrations

Apply all pending Prisma migrations:

```bash
docker exec -it career-os-backend pnpm prisma migrate deploy
```

> Run `prisma generate` whenever the Prisma schema changes. Run `prisma migrate deploy` whenever new migrations need to be applied.

### 5. View application logs

Follow the backend logs:

```bash
docker compose logs -f app
```

### 6. Access the application

**API:** http://localhost:5000

**API Documentation:** http://localhost:5000/api/docs

### Useful Commands

Stop the services:

```bash
docker compose down
```

Rebuild and restart the services:

```bash
docker compose up -d --build
```

Open a shell inside the backend container:

```bash
docker exec -it career-os-backend sh
```

View logs for all services:

```bash
docker compose logs -f
```

Stop the services and remove their volumes:

```bash
docker compose down -v
```
