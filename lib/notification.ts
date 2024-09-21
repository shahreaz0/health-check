import { env } from "../configs/env"
import { ResponseError, fetchWrapper } from "./fetch"

type Option = {
  to: string
  message: string
}

export async function sendSms(opt: Option) {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${env.get("twilioAccountSid")}/Messages.json`

    const resp = await fetchWrapper(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${env.get("twilioAccountSid")}:${env.get("twilioAuthToken")}`)}`,
      },
      body: new URLSearchParams({
        To: opt.to,
        From: env.get("twilioPhoneNumber") as string,
        Body: opt.message,
      }),
    })

    const data = await resp.json()

    console.log(data)
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(error.message)
    }
  }
}
