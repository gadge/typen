import { BOO, NUL, NUM, OBJ, STR } from '@typen/enum-data-types'
import { isNumeric } from '@typen/num-strict'
import { typ } from '@typen/typ'

const NUMSTR = 'numstr'
const MISC = 'misc'

export const inferType = x => {
  const t = typeof x
  return t === STR
    ? isNumeric(x) ? NUMSTR : STR
    : t === OBJ ? typ(x) : t
}

/**
 *
 * @param {*[]} vec
 * @return {string|unknown}
 */
export function vectorType (vec) {
  if (!vec.length) return NUL
  const types = vec.map(inferType)
  const s = new Set(types)
  let size = new Set(types).size
  if (size === 1) return types[0]
  if (size === 2 && s.has(NUM) && s.has(NUMSTR)) return NUMSTR
  return MISC
}

export const selectParser = (typeName) => {
  switch (typeName) {
    case STR:
      return String
    case NUM:
    case 'float':
      return Number.parseFloat
    case 'integer':
      return Number.parseInt
    case BOO:
      return Boolean
    default:
      return x => x
  }
}

