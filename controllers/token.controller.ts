import { createStore, deleteStore, readStore, updateStore } from "../lib/store"
import {
  generateId,
  validatePhone,
  validateString,
  validateToken,
  verifyPassword,
} from "../lib/utils"
import type { Request, ResponseCallBack } from "../types/server..type"
import type { Token } from "../types/token.type."
import type { User } from "../types/user.type"

export function tokenController(req: Request, callback: ResponseCallBack) {
  if (!["get", "post", "put", "delete"].includes(req.method as string)) {
    return callback(405, {
      message: "method not allowed",
    })
  }

  controller[req.method as keyof typeof controller](req, callback)
}

const controller = {
  get: async (req: Request, callback: ResponseCallBack) => {
    const token = req.url.searchParams.get("token")

    if (!validateToken(token)) {
      return callback(404, {
        message: "Enter valid token",
      })
    }

    try {
      const data = await readStore({ dir: "tokens", filename: `${token}.json` })

      callback(200, {
        data,
      })
    } catch (error) {
      return callback(404, {
        message: "Not Found",
      })
    }
  },
  post: async (req: Request<{ phone: string; password: string }>, callback: ResponseCallBack) => {
    const isValidInput = ["phone", "password"].every((p) => {
      const v = req.body[p as keyof typeof req.body]

      if (p === "phone") {
        return validatePhone(v)
      }

      return validateString(v)
    })

    if (!isValidInput) {
      return callback(404, {
        message: "Enter valid input",
      })
    }

    try {
      const user = await readStore<User>({ dir: "users", filename: `${req.body.phone}.json` })

      if (!verifyPassword(req.body.password, user.password)) {
        return callback(400, { message: "phone or password is incorrect" })
      }

      const tokenId = generateId()
      const expires = Date.now() + 60 * 60 * 1000

      const token = {
        id: tokenId,
        expires,
        phone: user.phone,
      }

      await createStore({ data: token, dir: "tokens", filename: `${tokenId}.json` })

      callback(200, {
        message: "token created",
        token,
      })
    } catch (error) {
      return callback(400, { message: error instanceof Error && error.message })
    }
  },
  put: async (req: Request<{ extend: boolean }>, callback: ResponseCallBack) => {
    if (!validateToken(req.queryParams.id)) {
      return callback(400, {
        message: "Enter valid token",
      })
    }

    if (typeof req.body.extend === "boolean" && !req.body.extend) {
      return callback(400, {
        message: "extend is missing",
      })
    }

    try {
      const token = await readStore<Token>({
        dir: "tokens",
        filename: `${req.queryParams.id}.json`,
      })

      if (token.expires < Date.now()) {
        return callback(400, {
          message: "Token already expired",
        })
      }

      token.expires = Date.now() + 60 * 60 * 1000

      const newToken = await updateStore({
        dir: "tokens",
        filename: `${req.queryParams.id}.json`,
        data: token,
      })

      callback(200, {
        message: "token updated",
        token: newToken,
      })
    } catch (error) {
      return callback(400, { message: error instanceof Error && error.message })
    }
  },
  delete: async (req: Request, callback: ResponseCallBack) => {
    const id = req.queryParams.id

    if (!validateToken(id)) {
      return callback(400, {
        message: "Invalid token or token missing",
      })
    }

    try {
      await deleteStore({ dir: "token", filename: `${id}.json` })

      callback(200, {
        message: "token deleted",
      })
    } catch (error) {
      return callback(404, {
        message: "Token not found.",
      })
    }
  },
}
