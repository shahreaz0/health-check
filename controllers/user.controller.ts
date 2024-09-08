import type { Request, ResponseCallBack } from "../types/server-types"

export function userController(req: Request, callback: ResponseCallBack) {
  console.log("hello")

  if (!["get", "post", "put", "delete"].includes(req.method as string)) {
    return callback(405, {
      message: "method not allowed",
    })
  }

  controller[req.method as keyof typeof controller](req, callback)
}

const controller = {
  get: (req: Request, callback: ResponseCallBack) => {
    callback(200, {
      message: "get user",
    })
  },
  post: (req: Request, callback: ResponseCallBack) => {
    callback(200, {
      message: "get user",
      body: req.body,
    })
  },
  put: () => {},
  delete: () => {},
}
