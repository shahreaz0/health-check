import { createStore } from "../lib/store"
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
  post: async (
    req: Request<{ firstName: string; lastName: string; phone: string; password: string }>,
    callback: ResponseCallBack,
  ) => {
    const isValidInput = ["firstName", "lastName", "phone", "password"].every((p) => {
      const v = req.body[p as keyof typeof req.body]

      if (p === "phone") {
        return typeof v === "string" && v.trim().length === 11
      }

      return typeof v === "string" && v.trim().length > 0
    })

    if (isValidInput) {
      await createStore({ dir: "users", filename: `${req.body.phone}.json`, data: req.body })
    }

    callback(201, {
      message: "user created",
      body: req.body,
    })
  },
  put: () => {},
  delete: () => {},
}
