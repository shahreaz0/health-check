import { createStore, deleteStore, readStore, updateStore } from "../lib/store"
import {
  generateId,
  validateArrayOfNumbers,
  validatePhone,
  validateString,
  validateToken,
  verifyPassword,
} from "../lib/utils"
import type { Check } from "../types/check.type"
import type { Request, ResponseCallBack } from "../types/server..type"
import type { Token } from "../types/token.type."
import type { User } from "../types/user.type"

export function checkController(req: Request, callback: ResponseCallBack) {
  if (!["get", "post", "put", "delete"].includes(req.method as string)) {
    return callback(405, {
      message: "method not allowed",
    })
  }

  controller[req.method as keyof typeof controller](req, callback)
}

const controller = {
  get: async (req: Request, callback: ResponseCallBack) => {},
  post: async (req: Request<Check>, callback: ResponseCallBack) => {
    //       protocol: "http" | "https"
    //   url: string
    //   method: "GET" | "POST" | "PUT" | "DELETE"
    //   successCodes: string[]
    //   timeoutSeconds: number

    const protocol =
      validateString(req.body.protocol) && ["https", "http"].includes(req.body.protocol)

    const method =
      validateString(req.body.method) && ["GET", "POST", "PUT", "DELETE"].includes(req.body.method)

    const successCodes = validateArrayOfNumbers(req.body.successCodes)
    const timeoutSeconds = Number.isInteger(req.body.timeoutSeconds)

    if ([protocol, method, successCodes, timeoutSeconds].every((e) => !e)) {
      return callback(400, {
        message: "Not valid input",
      })
    }

    callback(201, {
      message: "check created",
    })
  },

  put: async (req: Request, callback: ResponseCallBack) => {},
  delete: async (req: Request, callback: ResponseCallBack) => {},
}
