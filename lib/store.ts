import fs from "node:fs/promises"
import path from "node:path"

type Options = {
  dir?: string
  data: unknown
  filename?: string
}

export async function createStore(options: Options) {
  try {
    const dir = options?.dir ? `/${options.dir}` : ""
    const filename = options?.filename || "data.json"

    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)
    console.log(filePath)

    const fileHandler = await fs.open(filePath, "w")

    await fileHandler.writeFile(JSON.stringify(options.data))

    await fileHandler.close()
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error
  }
}

export async function readStore<T = any>(options: Omit<Options, "data"> = {}) {
  try {
    const dir = options?.dir ? `/${options.dir}` : ""
    const filename = options?.filename || "data.json"

    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)
    //
    const data = await fs.readFile(filePath, "utf8")

    return JSON.parse(data) as T
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: <explanation>
    throw error
  }
}

export async function updateStore(options: Options) {
  try {
    const dir = options?.dir ? `/${options.dir}` : ""
    const filename = options?.filename || "data.json"
    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)

    const fileHandler = await fs.open(filePath, "r+")

    await fileHandler.truncate()

    await fileHandler.writeFile(JSON.stringify(options.data))

    await fileHandler.close()

    return options.data
  } catch (error) {
    console.log(error)
  }
}

export async function deleteStore(options: Omit<Options, "data"> = {}) {
  try {
    const dir = options?.dir ? `/${options.dir}` : ""
    const filename = options?.filename || "data.json"
    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)

    await fs.unlink(filePath)
  } catch (error) {
    console.log(error)
  }
}
