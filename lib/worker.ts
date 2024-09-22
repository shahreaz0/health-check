function gatherAllChecks() {}

function loop() {
  setInterval(() => {
    gatherAllChecks()
  }, 1000 * 60)
}

export function initWorker() {
  //   loop()
}
