import { createStore, deleteStore, readStore, updateStore } from "../lib/store"
import { hashPassword, validatePhone, validateString } from "../lib/utils"
import type { Request, ResponseCallBack } from "../types/server-types"

export function userController(req: Request, callback: ResponseCallBack) {
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
  post: async (
    req: Request<{ firstName: string; lastName: string; phone: string; password: string }>,
    callback: ResponseCallBack,
  ) => {
    const isValidInput = ["firstName", "lastName", "phone", "password"].every((p) => {
      const v = req.body[p as keyof typeof req.body]

      if (p === "phone") {
        return validatePhone(v)
      }

      return validateString(v)
    })

    if (!isValidInput) {
      return callback(404, {
        message: "Inter valid input",
      })
    }

    const hashedPassword = hashPassword(req.body.password)

    const { password, ...rest } = req.body

    await createStore({
      dir: "users",
      filename: `${req.body.phone}.json`,
      data: { ...rest, password: hashedPassword },
    })

    callback(201, {
      message: "user created",
      body: req.body,
    })
  },
  put: async (
    req: Request<{ firstName: string; lastName: string; password: string }>,
    callback: ResponseCallBack,
  ) => {
    const phone = req.queryParams.phone

    if (!validatePhone(phone)) {
      return callback(400, {
        message: "Invalid phone number or phone number missing",
      })
    }

    const isValidInput = ["firstName", "lastName", "password"].some((p) => {
      const v = req.body[p as keyof typeof req.body]

      return validateString(v)
    })

    if (isValidInput) {
      try {
        const data = await readStore({ dir: "users", filename: `${phone}.json` })

        console.log(data)

        if (data.firstname) {
          data.firstName = req.body.firstName
        }
        if (data.lastName) {
          data.lastName = req.body.lastName
        }
        if (data.password) {
          data.password = hashPassword(req.body.password)
        }

        const d = await updateStore({ dir: "users", filename: `${phone}.json`, data })

        callback(200, {
          message: "user updated",
          body: d,
        })
      } catch (error) {
        return callback(404, {
          message: "User not found.",
        })
      }
    }

    // const hashedPassword = hashPassword(req.body.password)

    // const { password, ...rest } = req.body

    // await createStore({
    //   dir: "users",
    //   filename: `${req.body.phone}.json`,
    //   data: { ...rest, password: hashedPassword },
    // })
  },
  delete: async (
    req: Request<{ firstName: string; lastName: string; password: string }>,
    callback: ResponseCallBack,
  ) => {
    const phone = req.queryParams.phone

    if (!validatePhone(phone)) {
      return callback(400, {
        message: "Invalid phone number or phone number missing",
      })
    }

    try {
      await deleteStore({ dir: "users", filename: `${phone}.json` })

      callback(200, {
        message: "user deleted",
      })
    } catch (error) {
      return callback(404, {
        message: "User not found.",
      })
    }

    // const hashedPassword = hashPassword(req.body.password)

    // const { password, ...rest } = req.body

    // await createStore({
    //   dir: "users",
    //   filename: `${req.body.phone}.json`,
    //   data: { ...rest, password: hashedPassword },
    // })
  },
}
