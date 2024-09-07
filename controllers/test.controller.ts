import type { Request, ResponseCallBack } from "../types/server-types"

export function testController(req: Request, callback: ResponseCallBack) {
  console.log("hello")

  callback(200, {
    message: "hello from test",
  })
}
