export type Check = {
  id: string
  protocol: "http" | "https"
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  successCodes: string[]
  timeoutSeconds: number
  userPhone: string
}
