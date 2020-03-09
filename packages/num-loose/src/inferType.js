import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { typ } from '@typen/typ'
import { isNumeric } from './isNumeric'

/**
 *
 * @param {*} x
 * @return {string}
 */
export const inferType = x => {
  const t = typeof x
  return t === STR
    ? isNumeric(x) ? NUM : STR
    : t === OBJ ? typ(x) : t
}
