import { otype } from '../utils/typen'
import { NUM, OBJ, STR } from './enums.brief'

const check = x => !!x || x === 0

export const isNumeric = x => !!(x = +x) || x === 0

export const parseNum = x => !!(x = +x) || x === 0 ? x : NaN

/**
 *
 * @param {*} x
 * @return {string}
 */
export const inferData = x => {
  const t = typeof x
  return t === STR
    ? check(+x) ? NUM : STR
    : t === OBJ ? otype(x).toLowerCase() : t
}
