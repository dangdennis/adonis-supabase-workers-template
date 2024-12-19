import { ApplicationService } from '@adonisjs/core/types'
import { PrismaClient } from '@prisma/client'

export default class PrismaProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    // This container binding types is setup in types/prisma.ts
    this.app.container.bindValue('prisma', new PrismaClient())
  }

  async boot() {
    const prisma = await this.app.container.make('prisma')
    await prisma.$connect()
  }

  async shutdown() {
    const prisma = await this.app.container.make('prisma')
    await prisma.$disconnect()
  }
}
