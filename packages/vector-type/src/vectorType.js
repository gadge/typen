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
  const config = this
  const types = inferTypes.call(config, vec)
  if (types.length === 1) return types[0]
  if (types.length === 2 && types.includes(NUM) && types.includes(NUMSTR)) return NUMSTR
  return MISC
}

/**
 *
 * @param {Object} config
 * @param {Function} [config.inferType]
 * @param {boolean} [config.omitNull]
 * @return Function
 */
export const VectorType = (config = {}) => {
  return vectorType.bind(config)
}

