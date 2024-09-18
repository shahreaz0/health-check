export type Check = {
  protocol: "http" | "https"
  url: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  successCodes: string[]
  timeoutSeconds: number
}
