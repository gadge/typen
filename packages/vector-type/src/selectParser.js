import { BOO, NUM, STR, }    from '@typen/enum-data-types'
import { FLOAT, INT, RATIO } from '@typen/enum-tabular-types'

export const selectParser = (typeName) => {
  switch (typeName) {
    case STR:
      return String
    case NUM:
    case FLOAT:
    case RATIO:
      return Number.parseFloat
    case INT:
      return Number.parseInt
    case BOO:
      return Boolean
    default:
      return x => x
  }
}
