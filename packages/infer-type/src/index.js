import { OBJ, STR } from '@typen/enum-data-types'
import { typ } from '@typen/typ'
import { inferTypeNaive } from './inferTypeNaive'
import { isNumeric as isNum } from '@typen/num-strict'

export const inferType = function (x) {
  const { numstr, isNumeric } = this, t = typeof x
  return t === STR
    ? isNumeric(x) ? numstr : STR
    : t === OBJ ? typ(x) : t
}

export const InferType = ({ isNumeric, numstr } = {}) => {
  if (!isNumeric && !numstr) return inferTypeNaive
  return inferType.bind({ isNumeric: isNumeric ?? isNum, numstr: numstr ?? NUM })
}
