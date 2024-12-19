import SampleService from '#services/sample_service/sample_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SampleController {
  constructor(protected sample: SampleService) {}

  index(ctx: HttpContext) {
    return this.sample.hello(ctx)
  }

  protectedIndex(ctx: HttpContext) {
    ctx.logger.info('This is a protected route')
    return 'This is a protected route'
  }
}
