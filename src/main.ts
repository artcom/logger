import * as Winston from "winston"

export * as Winston from "winston"

const logErrorProp = Winston.format(info => {
  if (info.error instanceof Error) {
    info.error = { ...info.error, message: info.error.message, stack: info.error.stack }
  }
  return info
})

const reorderKeys = Winston.format((info, keyOrder) => {
  const orderedKeys = [...new Set([...keyOrder, ...Object.keys(info)])]

  // simply delete and re-add keys to ensure order
  orderedKeys.forEach(key => {
    const value = info[key]
    delete info[key]
    info[key] = value
  })

  return info
})

export function createLogger({
  transports = [new Winston.transports.Console({ level: "debug" })],
  keyOrder = ["timestamp", "level", "message"]
} = {}) : Winston.Logger {
  return Winston.createLogger({
    format: Winston.format.combine(
      Winston.format.errors({ stack: true }),
      logErrorProp(),
      Winston.format.timestamp(),
      reorderKeys(keyOrder),
      Winston.format.json()),
    transports
  })
}

