import { NUL, NUM } from '@typen/enum-data-types'
import { MISC, NUMSTR } from '@typen/enum-tabular-types'
import { inferTypes } from './inferTypes'

/**
 *
 * @param {*[]} vec
 * @return {string|unknown}
 */
export function vectorType (vec) {
  if (!vec?.length) return NUL
  const types = inferTypes.call(this, vec)
  if (types.length === 1) return types[0]
  if (types.length === 2 && types.includes(NUM) && types.includes(NUMSTR)) return NUMSTR
  return MISC
}

export const VectorType = ({ inferType, omitNull } = {}) => {
  return vectorType.bind({ inferType, omitNull })
}

