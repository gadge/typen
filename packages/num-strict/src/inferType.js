import { NUM, OBJ, STR } from '@typen/enums'
import { typ } from '@typen/typ'
import { isNumeric } from './isNumeric'

export const inferType = x => {
  const t = typeof x
  return t === STR
    ? isNumeric(x) ? NUM : STR
    : t === OBJ ? typ(x) : t
}
