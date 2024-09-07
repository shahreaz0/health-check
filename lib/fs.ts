import fs from "node:fs/promises"

type Options = {
  dir?: string
  data: unknown
  filename?: string
}

export async function create(options: Options) {
  try {
    const dir = options.dir ? `/${options.dir}` : ""
    const filename = options.filename || "data.json"
    const path = `${import.meta.dirname}/../.data/${dir}/${filename}`

    const file = await fs.open(path, "w")

    await fs.writeFile(file, JSON.stringify(options.data))
  } catch (error) {
    console.log(error)
  }
}
