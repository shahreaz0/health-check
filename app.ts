import { sendSms } from "./lib/notification"
import { createServer } from "./lib/server"

function init() {
  createServer()
}

init()
