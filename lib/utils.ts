import { pbkdf2Sync, randomBytes } from "node:crypto"
import type { Token } from "../types/token.type."
import * as document from "./db"

export function cleanPath(pathname: string) {
  let cleanedPath = pathname.replace(/\/{2,}/g, "/")

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

export function validateArrayOfNumbers(arr: unknown) {
  if (!Array.isArray(arr)) {
    return false
  }

  return arr.every((element) => typeof element === "number")
}

export function validateHttpUrl(url: unknown) {
  if (typeof url !== "string") return false

  try {
    const parsedURL = new URL(url)
    return parsedURL.protocol === "http:" || parsedURL.protocol === "https:"
  } catch (_) {
    return false
  }
}

export function generateId(length = 20) {
  const tokens = "abcdefghijklmnopqrstuvwxyz1234567890"
  let id = ""

  for (let index = 0; index < length; index++) {
    id += tokens.split("")[Math.floor(Math.random() * tokens.length)]
  }

  return id
}

export async function verifyToken(opt: { id: string; phone: string }) {
  try {
    const token = await document.read<Token>({ dir: "tokens", filename: `${opt.id}.json` })

    if (token.phone === opt.phone && token.expires > Date.now()) {
      return true
    }

    return false
  } catch (error) {
    //
    console.log(error)
  }
}

export async function parseToken(tokenId: string) {
  try {
    const token = await document.read<Token>({ dir: "tokens", filename: `${tokenId}.json` })

    return token
  } catch (error) {
    console.log(error)
  }
}
