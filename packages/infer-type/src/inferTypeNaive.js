import { OBJ } from '@typen/enum-data-types'
import { typ } from '@typen/typ'

export const inferTypeNaive = x => {
  const t = typeof x
  return t === OBJ ? typ(x) : t
}
