import { pbkdf2Sync, randomBytes } from "node:crypto"

export function cleanPath(pathname: string) {
  // Step 1: Replace multiple consecutive slashes with a single slash
  let cleanedPath = pathname.replace(/\/{2,}/g, "/")

  // Step 2: Remove trailing slash at the end (if it's not the root '/')
  if (cleanedPath !== "/") {
    cleanedPath = cleanedPath.replace(/\/$/, "")
  }

  return cleanedPath
}

export function parseJson(json: string) {
  let output: object

  try {
    output = JSON.parse(json)
  } catch (_error) {
    output = {}
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

  return `${salt}$${hash}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split("$")

  const hashToVerify = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

  return hashToVerify === originalHash
}

export function validateString(v: unknown) {
  return typeof v === "string" && v.trim().length > 0
}

export function validatePhone(v: unknown) {
  return typeof v === "string" && v.trim().length === 11
}
export function validateToken(v: unknown) {
  return typeof v === "string" && v.trim().length === 20
}

export function generateId(length = 20) {
  const tokens = "abcdefghijklmnopqrstuvwxyz1234567890"
  let id = ""

  for (let index = 0; index < length; index++) {
    id += tokens.split("")[Math.floor(Math.random() * tokens.length)]
  }

  return id
}

console.log(generateId())
