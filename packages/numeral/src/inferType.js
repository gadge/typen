import { NUM, OBJ, STR } from '@typen/enum-data-types'
import { typ }           from '@typen/typ'
import { COMMA }         from './comma'
import { isNumeric }     from './isNumeric'

export const inferType = x => {
  const t = typeof x
  return t === STR
    ? isNumeric(x.replace(COMMA, '')) ? NUM : STR
    : t === OBJ ? typ(x) : t
}
