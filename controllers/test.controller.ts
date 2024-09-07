import type { Request, ResponseCallBack } from "../server"

export function testController(req: Request, callback: ResponseCallBack) {
  console.log("hello")

  callback(200, {
    message: "hello from test",
  })
}
