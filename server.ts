import http from "node:http"
import { env } from "./config/env"

type App = {
  createServer?: () => void
  requestHandler?: Parameters<typeof http.createServer>[1]
}
const app: App = {}

app.createServer = () => {
  const server = http.createServer(app.requestHandler)

  server.listen(env.get("port"), () => {
    console.log(`http://localhost:${env.get("port")}`)
  })
}

app.requestHandler = (req, res) => {
  res.end("health check")
}

app.createServer()
