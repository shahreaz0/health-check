import fsSync from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"

type Options = {
  dir: string
  data: unknown
  filename: string
}

export async function createStore<T = any>(options: Options) {
  try {
    const dir = options.dir
    const filename = options.filename

    const dirPath = path.join(import.meta.dirname, "..", ".data", dir)

    if (!fsSync.existsSync(dirPath)) {
      await fs.mkdir(dirPath)
    }

    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)

    const fileHandler = await fs.open(filePath, "w")

    await fileHandler.writeFile(JSON.stringify(options.data))

    await fileHandler.close()
    return options.data as T
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function readStore<T = any>(options: Omit<Options, "data">) {
  try {
    const dir = options.dir
    const filename = options.filename

    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)
    //
    const data = await fs.readFile(filePath, "utf8")

    return JSON.parse(data) as T
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateStore<T = any>(options: Options) {
  try {
    const dir = options.dir
    const filename = options.filename

    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)

    const fileHandler = await fs.open(filePath, "r+")

    await fileHandler.truncate()

    await fileHandler.writeFile(JSON.stringify(options.data))

    await fileHandler.close()

    return options.data as T
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteStore(options: Omit<Options, "data">) {
  try {
    const dir = options.dir
    const filename = options.filename

    const filePath = path.join(import.meta.dirname, "..", ".data", dir, filename)

    await fs.unlink(filePath)
  } catch (error) {
    console.log(error)
    throw error
  }
}
