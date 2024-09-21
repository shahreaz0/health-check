process.loadEnvFile(".env")

const _env = {
  port: process.env.PORT,
  twilioAccountSid: process.env.TWILIO_ACC_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: "+13342039847",
}

export const env = {
  get(key: keyof typeof _env) {
    return _env[key]
  },
}
