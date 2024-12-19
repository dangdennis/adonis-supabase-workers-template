import { LoggerService } from '@adonisjs/core/types'
import { BaseJobHandler } from './base_job_handler.js'
import { PrismaClient } from '@prisma/client'
import { SampleJobHandler } from './sample_job_handler.js'
import { Sample2JobHandler } from './sample2_job_handler.js'

export class JobRegistry {
  constructor({ prisma, logger }: { prisma: PrismaClient; logger: LoggerService }) {
    this.logger = logger
    this.prisma = prisma

    this.handlers = [
      new SampleJobHandler({
        prisma: this.prisma,
        logger: this.logger.child({
          name: 'SampleJobHandler',
        }),
      }),
      new Sample2JobHandler({
        prisma: this.prisma,
        logger: this.logger.child({
          name: 'Sample2JobHandler',
        }),
      }),
    ]
  }

  private logger: LoggerService
  private prisma: PrismaClient
  private handlers: BaseJobHandler[]

  /**
   * Register a job handler class (not instance)
   */
  register(handler: BaseJobHandler) {
    if (this.handlers.some((h) => h.getQueueName() === handler.getQueueName())) {
      throw new Error(`Duplicate queue name: ${handler.getQueueName()}`)
    }

    this.handlers.push(handler)
  }

  getHandlers() {
    return this.handlers
  }
}
