import { PrismaClient } from '@prisma/client'
import { BaseJobHandler } from './base_job_handler.js'
import { pgmqRead } from '@prisma/client/sql'
import { Logger } from '@adonisjs/core/logger'

export class SampleJobHandler extends BaseJobHandler {
  constructor({ prisma, logger }: { prisma: PrismaClient; logger: Logger }) {
    super({ queueName: 'sample-queue', prisma, batchSize: 1, visibilitySeconds: 1, logger })
  }

  public async handle(msg: pgmqRead.Result) {
    console.log('handle sample job')
    console.log('SampleJob', msg)
  }
}