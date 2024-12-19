/*
|--------------------------------------------------------------------------
| Worker process entrypoint
|--------------------------------------------------------------------------
|
| The "worker.ts" file is the entrypoint for starting the background
| worker process that handles Supabase queue messages. It calls the ace command worker:start.
| This file handles the initialization of the Adonis application.
|
| To make changes to the worker, look inside "commands/worker_start.ts".
|
*/

import 'reflect-metadata'
import { Ignitor } from '@adonisjs/core'
import { JobRegistry } from '../app/jobs/job_registry.js'

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

class Worker {
  private isShuttingDown = false

  async run() {
    const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER }).tap((app) => {
      app.booting(async () => {
        await import('#start/env')
      })
      app.listen('SIGTERM', () => app.terminate())
      app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
    })

    const application = ignitor.createApp('console')
    await application.init()
    await application.boot()

    const logger = await application.container.make('logger')
    const prisma = await application.container.make('prisma')

    logger.info('Starting worker process...')

    const jobRegistry = new JobRegistry({ prisma, logger })

    const shutdown = async () => {
      if (this.isShuttingDown) {
        return
      }
      this.isShuttingDown = true

      logger.info('Shutting down gracefully...')
      await prisma.$disconnect()
      process.exit(0)
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)

    const pollingLoops = jobRegistry.getHandlers().map(async (handler) => {
      while (!this.isShuttingDown) {
        await handler.poll()
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    })

    await Promise.all(pollingLoops)
  }
}

new Worker().run().catch((error) => {
  console.error('Worker failed to start:', error)
  process.exit(1)
})
