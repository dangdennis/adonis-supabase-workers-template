import HelloService from '#services/hello_service/hello_service'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

// Run with `node ace test`
test.group('Sample index', () => {
  test('example test that explains how to swap a dependency', async ({ client, assert }) => {
    class FakeHelloService extends HelloService {
      public sayHello(name: string): Promise<string> {
        return Promise.resolve(`Hello ${name} from fake service`)
      }
    }

    app.container.swap(HelloService, () => {
      return new FakeHelloService()
    })

    // The test bootstrap sets up the adonis application and automatically registers all dependencies.
    // Because we swapped out the HelloService dependency, the SampleController will
    // automatically use the FakeHelloService via the SampleService.
    const response = await client.get('/sample')
    assert.equal(response.status(), 200)
    assert.equal(response.text(), 'Hello world from fake service')

    app.container.restoreAll()
  })
})
