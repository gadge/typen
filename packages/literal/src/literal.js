import { STR } from '@typen/enum-data-types'

export const LITERAL = /[A-Za-z0-9]+/g
export const literal = x => LITERAL.test(x)
export const isString = x => typeof x === STR
