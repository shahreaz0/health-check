import http from "node:http"
import { env } from "./configs/env"
import { notFound } from "./controllers/error.controller"
import { cleanPath } from "./lib/utils"
import { routes } from "./routes"

import { sendSms } from "./lib/notification"
import type { App } from "./types/server..type"

// sendSms({ to: "+8801844668099", message: "hello" })

const app: App = {}

app.createServer = () => {
  const server = http.createServer(app.requestHandler)

  server.listen(env.get("port"), () => {
    console.log(`http://localhost:${env.get("port")}`)
  })
}

app.requestHandler = (req, res) => {
  const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`)
  const cleanPathname = cleanPath(url.pathname)
  const queryParams = Object.fromEntries(url.searchParams)
  const method = req.method?.toLowerCase()
  const headers = req.headers
  const body: Buffer[] = []

  const selectedRoute = routes[cleanPathname as keyof typeof routes]
    ? routes[cleanPathname as keyof typeof routes]
    : notFound

  req.on("data", (buffer) => {
    body.push(buffer)
  })

  req.on("end", () => {
    const request = {
      url,
      cleanPathname,
      queryParams,
      method,
      headers,
      body: JSON.parse(Buffer.concat(body).toString() || "{}"),
    }

    selectedRoute(request, (statusCode, response) => {
      const code = typeof statusCode === "number" ? statusCode : 500
      const ress = typeof response === "object" ? response : {}

      res.setHeader("Content-Type", "application/json")
      res.writeHead(code)
      res.end(JSON.stringify(ress))
    })
  })
}

app.createServer()
