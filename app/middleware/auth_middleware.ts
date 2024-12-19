import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import { jwtVerify } from 'jose'
import app from '@adonisjs/core/services/app'

/**
 * Auth middleware is used to authenticate HTTP requests using Supabase JWT tokens
 * and deny access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to when authentication fails
   */
  redirectTo = '/'

  async handle(ctx: HttpContext, next: NextFn) {
    try {
      // Get the Authorization header
      const authHeader = ctx.request.header('Authorization')
      if (!authHeader?.startsWith('Bearer ')) {
        return ctx.response.redirect(this.redirectTo)
      }

      // Extract the token
      const token = authHeader.split(' ')[1]
      if (!token) {
        return ctx.response.redirect(this.redirectTo)
      }

      const secret = new TextEncoder().encode(env.get('SUPABASE_JWT_SECRET'))
      const { payload } = await jwtVerify(token, secret)

      // Add the verified user to the context
      const prisma = await app.container.make('prisma')
      ctx.user = await prisma.player.findUniqueOrThrow({
        where: {
          supabase_id: payload.sub,
        },
      })

      return next()
    } catch (error) {
      // If token verification fails, redirect to login
      return ctx.response.redirect(this.redirectTo)
    }
  }
}
