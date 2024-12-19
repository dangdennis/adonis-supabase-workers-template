// Example service to illustrate how to create new services.
// Services are then injected into controllers and other services via Adonis's dependency injection framework.
// All our business logic should be in services.
// If there are dependencies between services, then we should inject them via constructor injection.

import { inject } from '@adonisjs/core'
import HelloService from '../hello_service/hello_service.js'
import app from '@adonisjs/core/services/app'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SampleService {
  constructor(protected helloService: HelloService) {}

  @inject()
  async hello(ctx: HttpContext): Promise<string> {
    const prisma = await app.container.make('prisma')

    ctx.logger.info(
      `Querying the bio parts table to demonstrate db access: biopart.count [${await prisma.bioPart.count()}]`
    )

    return this.helloService.sayHello('world')
  }
}
