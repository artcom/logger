import * as Winston from "winston"

import { LEVEL, MESSAGE } from "triple-beam"
import { configure } from "safe-stable-stringify"

const stringify = configure({ deterministic: false })

export { Winston }

function resolveError(obj: any) {
  return {
    ...obj,
    level: obj.level,
    [LEVEL]: obj[LEVEL as any] || obj.level,
    message: obj.message,
    stack: obj.stack.split("\n"),
  }
}

function resolveErrors(obj: any) {
  if (obj instanceof Error) {
    return resolveError(obj)
  }

  if (obj.message instanceof Error) {
    const { message, stack } = obj.message
    return {
      ...obj,
      ...obj.message,
      message,
      stack: stack.split("\n"),
    }
  }

  if (obj.stack) {
    return {
      ...obj,
      stack: obj.stack.split("\n"),
    }
  }

  return obj
}

const toJson = Winston.format((info: any, keyOrderObj) => {
  info = resolveErrors(info)

  for (const prop in info) {
    if (info[prop] instanceof Error) {
      info[prop] = resolveError(info[prop])
    }
  }

  info.timestamp = new Date().toLocaleString()
  info[MESSAGE as any] = stringify(Object.assign({}, keyOrderObj, info))
  return info
})

export function createLogger({
  transports = [new Winston.transports.Console({ level: "debug" })],
  keyOrder = ["timestamp", "level", "message"],
} = {}): Winston.Logger {
  const keyOrderObj = keyOrder.reduce((acc: any, key: string) => ({ ...acc, [key]: null }), {})

  return Winston.createLogger({ format: toJson(keyOrderObj), transports })
}
