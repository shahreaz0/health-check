import type { Request, ResponseCallBack } from "../types/server..type"

export function notFound(req: Request, callback: ResponseCallBack) {
  console.log("not found")

  callback(404, {
    message: "not found",
  })
}
