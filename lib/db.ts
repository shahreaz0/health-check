import fsSync from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"

type Options = {
  dir: string
  data: unknown
  filename: string
}

export async function create<T = any>(options: Options) {
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

export async function read<T = any>(options: Omit<Options, "data">) {
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

export async function update<T = any>(options: Options) {
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

export async function remove(options: Omit<Options, "data">) {
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

export async function getList(dir: string) {
  try {
    const dirPath = path.join(import.meta.dirname, "..", ".data", dir)

    const a = await fs.readdir(dirPath)

    return a.map((e) => e.replace(".json", ""))
  } catch (_error) {
    return []
  }
}
