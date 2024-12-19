import { Logger } from '@adonisjs/core/logger'
import { PrismaClient } from '@prisma/client'
import { pgmqRead, pgmqDelete } from '@prisma/client/sql'

export abstract class BaseJobHandler {
  constructor({
    queueName,
    prisma,
    batchSize,
    visibilitySeconds,
    logger,
  }: {
    queueName: string
    prisma: PrismaClient
    batchSize?: number
    visibilitySeconds?: number
    logger: Logger
  }) {
    this.prisma = prisma
    this.queueName = queueName
    this.logger = logger
    this.batchSize = batchSize ?? 10
    this.sleepSeconds = visibilitySeconds ?? 30
  }

  protected queueName: string
  protected logger: Logger
  protected prisma: PrismaClient
  protected batchSize: number
  protected sleepSeconds: number
  private isProcessing: boolean = false

  /**
   * Process a single message from the queue.
   * If no error is thrown, the message will be deleted from the queue.
   */
  abstract handle(message: pgmqRead.Result): Promise<void>

  /**
   * Internal method to process a single message and handle cleanup
   */
  protected async processMessage(message: pgmqRead.Result) {
    try {
      await this.handle(message)
      await this.prisma.$queryRawTyped(pgmqDelete(this.queueName, Number(message.msg_id)))
    } catch (error) {
      this.logger.error(error, 'error processing message')
    }
  }

  /**
   * Poll the queue for new messages
   */
  async poll() {
    if (this.isProcessing) {
      return
    }

    try {
      this.logger.info(`Polling queue ${this.queueName}`)
      this.isProcessing = true
      const rows = await this.prisma.$queryRawTyped(
        pgmqRead(this.queueName, this.sleepSeconds, this.batchSize)
      )
      await Promise.all(rows.map((message) => this.processMessage(message)))
    } catch (error) {
      console.error('failed to process message', error)
      this.logger.error(error, 'error processing message')
      await new Promise((resolve) => setTimeout(resolve, 5000))
    } finally {
      this.isProcessing = false
    }
  }

  getQueueName() {
    return this.queueName
  }
}
