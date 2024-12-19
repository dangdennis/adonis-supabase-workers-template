import { Player } from '@prisma/client'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    user?: Player
  }
}
