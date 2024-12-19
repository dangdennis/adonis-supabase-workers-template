import { symbols } from '@adonisjs/auth'
import type { SessionGuardUser, SessionUserProviderContract } from '@adonisjs/auth/types/session'
import app from '@adonisjs/core/services/app'
import { Player } from '@prisma/client'

export class SessionPrismaUserProvider implements SessionUserProviderContract<Player> {
  /**
   * Used by the event emitter to add type information to the events emitted by the session guard.
   */
  declare [symbols.PROVIDER_REAL_USER]: Player

  /**
   * Bridge between the session guard and your provider.
   */
  async createUserForGuard(user: Player): Promise<SessionGuardUser<Player>> {
    return {
      getId() {
        return user.supabase_id
      },
      getOriginal() {
        return user
      },
    }
  }

  /**
   * Find a user using the user id using your custom SQL library or ORM.
   */
  async findById(identifier: string): Promise<SessionGuardUser<Player> | null> {
    const prisma = await app.container.make('prisma')
    const user = await prisma.player.findUnique({
      where: {
        supabase_id: identifier,
      },
    })

    if (!user) {
      return null
    }

    return this.createUserForGuard(user)
  }
}
