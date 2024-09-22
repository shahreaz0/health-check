import type { Check } from "../types/check.type"
import * as document from "./db"
import { sendSms } from "./notification"

async function performCheck(check: Check) {
  try {
    const resp = await fetch(check.url, {
      signal: AbortSignal.timeout(check.timeoutSeconds * 1000),
    })

    const state = check.successCodes.includes(resp.status) ? "up" : "down"

    const alertWanted = check.lastChecked > 0 && state !== check.state

    check.state = state
    check.lastChecked = Date.now()

    await document.update({ dir: "checks", filename: `${check.id}.json`, data: check })

    if (alertWanted) {
      const message = `Your check for ${check.url} is currently ${check.state}`

      console.log({ to: check.userPhone, message })
    }
  } catch (error) {
    console.log(error)
  }
}

function validateChecks(check: Check) {
  const checkData = check

  checkData.state =
    typeof checkData.state === "string" && ["up", "down"].includes(checkData.state)
      ? checkData.state
      : "down"

  checkData.lastChecked =
    typeof checkData.lastChecked === "number" &&
    Number.isInteger(checkData.lastChecked) &&
    checkData.lastChecked > 0
      ? check.lastChecked
      : -1

  performCheck(checkData)
}

async function gatherAllChecks() {
  try {
    const checkList = await document.getList("checks")

    const promises = checkList.map((checkId) => {
      return document.read({ dir: "checks", filename: `${checkId}.json` })
    })

    const response = await Promise.allSettled(promises)

    const data = response.filter((res) => res.status === "fulfilled") as
      | PromiseFulfilledResult<Check>[]
      | undefined

    for (const e of data || []) {
      validateChecks(e.value)
    }
  } catch (error) {
    console.log(error)
  }
}

function loop() {
  setInterval(() => {
    gatherAllChecks()
  }, 1000 * 10)
}

export function initWorker() {
  gatherAllChecks()
  loop()
}
