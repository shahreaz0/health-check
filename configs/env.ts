process.loadEnvFile(".env")

const _env = {
  port: process.env.PORT,
}

export const env = {
  get(key: keyof typeof _env) {
    return _env[key]
  },
}
