import { STR } from '@typen/enum-data-types'

export const LITERAL = /[A-Za-z0-9]+/
export const isLiteral = x => LITERAL.test(x)
export const isString = x => typeof x === STR
