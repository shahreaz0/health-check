import type http from "node:http"

export type App = {
  createServer?: () => void
  requestHandler?: Parameters<typeof http.createServer>[1]
}

type A = Request<{}>

type RequestWithoutBody = {
  url: URL
  cleanPathname: string
  queryParams: {
    [k: string]: string
  }
  method: string | undefined
  headers: http.IncomingHttpHeaders
  body: any
}

type RequestWithBody<T> = {
  url: URL
  cleanPathname: string
  queryParams: {
    [k: string]: string
  }
  method: string | undefined
  headers: http.IncomingHttpHeaders
  body: T
}

export type Request<T = void> = T extends void ? RequestWithoutBody : RequestWithBody<T>

export type ResponseCallBack = (statusCode: number, responseObj: object) => void
