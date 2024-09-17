import type http from "node:http"

export type App = {
  createServer?: () => void
  requestHandler?: Parameters<typeof http.createServer>[1]
}

export type Request<ReqBody = any, ReqHeader = any> = {
  url: URL
  cleanPathname: string
  queryParams: {
    [k: string]: string
  }
  method: string | undefined
  headers: any extends ReqHeader ? http.IncomingHttpHeaders : ReqHeader
  body: ReqBody
}

export type ResponseCallBack = (statusCode: number, responseObj: object) => void
