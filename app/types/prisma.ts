declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    prisma: import('@prisma/client').PrismaClient
  }
}
