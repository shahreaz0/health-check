export type Check = {
  id: string
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  successCodes: number[]
  timeoutSeconds: number
  userPhone: string
  state: "up" | "down"
  lastChecked: number
}
