// A sample service to illustrate how one service can be injected into another service.

export default class HelloService {
  public async sayHello(name: string) {
    return `Hello ${name}`
  }
}
