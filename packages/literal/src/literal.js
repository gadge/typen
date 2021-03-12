import { NUM, STR } from '@typen/enum-data-types'

export const LITERAL = /[A-Za-z0-9]+/
export const HAN = /[\u4e00-\u9fa5]+|[\uff00-\uffff]+/
export const isLiteral = x => LITERAL.test(x)
export const isHan = x => HAN.test(x)
export const isString = x => typeof x === STR
export const isNumStr = x => {
  const t = typeof x
  return t === STR || t === NUM
}
export const hasLiteral = x => isString(x) && isLiteral(x)
export const hasHan = x => isString(x) && isHan(x)
export const hasAlpAndHan = x => isString(x) && isLiteral(x) && isHan()
