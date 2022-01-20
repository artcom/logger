import * as Winston from "winston"

export { Winston }

const logErrorProp = Winston.format(info => {
  if (info.error instanceof Error) {
    info.error = { ...info.error, message: info.error.message, stack: info.error.stack }
  }
  return info
})

const reorderKeys = Winston.format((info, keyOrderObj) => Object.assign({}, keyOrderObj, info))

export function createLogger({
  transports = [new Winston.transports.Console({ level: "debug" })],
  keyOrder = ["timestamp", "level", "message"]
} = {}) : Winston.Logger {
  const keyOrderObj = keyOrder.reduce((acc: any, key: string) => ({ ...acc, [key]: null }), {})

  return Winston.createLogger({
    format: Winston.format.combine(
      Winston.format.errors({ stack: true }),
      logErrorProp(),
      Winston.format.timestamp({ format: () => new Date().toLocaleString() }),
      reorderKeys(keyOrderObj),
      Winston.format.json()),
    transports
  })
}

