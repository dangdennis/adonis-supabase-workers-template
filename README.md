# AdonisJS + Prisma + Supabase Starter

This is the backend server for the Yomi Waifu Game, built with AdonisJS and Prisma.

## Initial Setup

1. Use [Volta](https://volta.sh/) or your favorite NPM version manager to install Node.js. We recommend Node.js 22 or higher.

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and other required environment variables.

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run database migrations:

```bash
npm run prisma:migrate
```

6. (Optional) Seed the database:

```bash
npm run prisma:seed
```

## Development

Run the development server:

```bash
npm run dev
```

Run the development worker (if needed):

```bash
npm run dev:worker
```

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run dev:worker` - Start the worker in development mode
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run start:worker` - Start the worker in production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Working with Prisma

Prisma is our ORM of choice. Here are the common commands:

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Deploy pending migrations
- `npm run prisma:dev` - Create a new migration
- `npm run prisma:studio` - Open Prisma Studio to manage data
- `npm run prisma:seed` - Run database seeds

To create a new migration:

```bash
npm run prisma:dev -- --name your_migration_name
```

## Deployment

The application is deployed on Render. The deployment process is automated through CI/CD:

1. Merges to the `main` branch automatically trigger a new deployment
2. Render will:
   - Install dependencies
   - Run `npm run build`
   - Execute `npm run prisma:generate` and `npm run prisma:migrate`
   - Start the server using `npm start`

## Type Support

The project is written in TypeScript. Run type checking before committing:

```bash
npm run typecheck
```
