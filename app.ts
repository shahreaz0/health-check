import { initServer } from "./lib/server"
import { initWorker } from "./lib/worker"

function init() {
  initServer()
  initWorker()
}

init()
