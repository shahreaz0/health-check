import { createStore, readStore } from "../lib/store"
import { generateId, validatePhone, validateString, verifyPassword } from "../lib/utils"
import type { Request, ResponseCallBack } from "../types/server"
import type { User } from "../types/user"

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
    const phone = req.url.searchParams.get("phone")

    if (!validatePhone(phone)) {
      return callback(404, {
        message: "Enter valid input",
      })
    }

    try {
      const data = await readStore({ dir: "users", filename: `${phone}.json` })

      const { password, ...rest } = data

      callback(200, {
        data: rest,
      })
    } catch (error) {
      return callback(404, {
        message: "Not found",
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
      const expires = Date.now() * 60 * 60 * 1000

      const token = {
        id: tokenId,
        expires,
        phone: user.phone,
      }

      await createStore({ data: token, dir: "tokens", filename: `${tokenId},json` })

      callback(200, {
        message: "token created",
        token,
      })
    } catch (error) {
      //

      return callback(400, { message: error instanceof Error && error.message })
    }
  },
  put: async (req: Request, callback: ResponseCallBack) => {},
  delete: async (req: Request, callback: ResponseCallBack) => {},
}
