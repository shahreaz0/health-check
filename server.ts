import http from "node:http"
import { env } from "./configs/env"
import { notFound } from "./controllers/error.controller"
import { cleanPath } from "./lib/utils"
import { routes } from "./routes"

import { create } from "./lib/fs"

create({ data: { name: "shahreaz" } })

//

type App = {
  createServer?: () => void
  requestHandler?: Parameters<typeof http.createServer>[1]
}

export type Request = {
  url: URL
  cleanPathname: string
  queryParams: {
    [k: string]: string
  }
  method: string | undefined
  headers: http.IncomingHttpHeaders
  body: string
}

export type ResponseCallBack = (statusCode: number, responseObj: object) => void

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
      body: Buffer.concat(body).toString(),
    }

    selectedRoute(request, (statusCode, response) => {
      const code = typeof statusCode === "number" ? statusCode : 500
      const ress = typeof response === "object" ? response : {}

      res.writeHead(code)
      res.end(JSON.stringify(ress))
    })
  })
}

app.createServer()
