import { Player as PlayerDb } from '@prisma/client'

/**
 * The player domain model
 */
export interface Player extends Pick<PlayerDb, 'supabase_id'> {}
