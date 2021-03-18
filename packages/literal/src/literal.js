import { CJK_LETTERS, FULL_LOWER, FULL_NUM, FULL_UPPER, HALF_LOWER, HALF_NUM, HALF_UPPER } from '@spare/regex-charset'
import { NUM, STR }                                                                        from '@typen/enum-data-types'

export const LITERAL_LOWER = `${HALF_UPPER}${HALF_LOWER}${HALF_NUM}`
export const LITERAL_UPPER = `${FULL_UPPER}${FULL_LOWER}${FULL_NUM}`
export const LITERAL = new RegExp(`[${LITERAL_LOWER}]+`) // LITERAL = /[A-Za-z0-9]+/
export const LITERAL_FULL = new RegExp(`[${CJK_LETTERS}${LITERAL_UPPER}]+`) // HAN = /[\u4e00-\u9fbf]+|[\uff00-\uffff]+/
export const LITERAL_ANY = new RegExp(`[${LITERAL_LOWER}${CJK_LETTERS}${LITERAL_UPPER}]+`)


export const isString = x => typeof x === STR
export const isNumStr = x => {
  const t = typeof x
  return t === STR || t === NUM
}

export const isLiteral = x => LITERAL.test(x)
export const isLiteralFull = x => LITERAL_FULL.test(x)
export const isLiteralAny = x => LITERAL_ANY.test(x)

export const hasLiteral = x => isString(x) && isLiteral(x)
export const hasLiteralFull = x => isString(x) && isLiteralFull(x)
export const hasLiteralAny = x => isString(x) && isLiteralAny(x)
