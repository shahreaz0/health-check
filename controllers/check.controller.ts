import { createStore, deleteStore, readStore, updateStore } from "../lib/store"
import {
  generateId,
  parseToken,
  validateArrayOfNumbers,
  validatePhone,
  validateString,
  validateToken,
  verifyPassword,
  verifyToken,
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

    if (!validateToken(req.headers.token)) {
      return callback(400, {
        message: "Invalid token",
      })
    }

    try {
      const token = await parseToken(req.headers.token as string)

      if (!token) return callback(400, { message: "Invalid token" })

      const valid = await verifyToken({
        id: req.headers.token as string,
        phone: token.phone as string,
      })

      if (!valid) {
        return callback(401, {
          message: "Unauthorize",
        })
      }

      const user = await readStore({ dir: "users", filename: `${token.phone}.json` })

      if (user?.checks?.length > 5) {
        return callback(401, {
          message: "User has already reached max check limit",
        })
      }

      const checkPayload = {
        id: generateId(20),
        userPhone: user.phone,
        protocol,
        method,
        successCodes,
        timeoutSeconds,
      }

      const checks = await createStore({
        dir: "checks",
        filename: `${checkPayload.id}.json`,
        data: checkPayload,
      })

      const userChecks: string[] = Array.isArray(user.checks) ? user.checks : []

      user.checks = [...userChecks, checkPayload.id]

      await updateStore({ dir: "users", filename: `${user.phone}.json`, data: user })

      callback(200, {
        message: checks,
      })
    } catch (error) {
      callback(500, {
        message: error instanceof Error && error.message,
      })
    }
  },

  put: async (req: Request, callback: ResponseCallBack) => {},
  delete: async (req: Request, callback: ResponseCallBack) => {},
}
