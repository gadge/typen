import { otype } from '../utils/typen'
import { NUM, OBJ, STR } from './enums.brief'

/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */
const vdt = (x, y) => isNaN(x - y) ? NaN : y

export class Num {
  // Angular 4.3
  static isNumeric (x) { return !isNaN(x - parseFloat(x)) }

  static numeric (x) { return vdt(x, parseFloat(x)) }

  static inferData (x) {
    const t = typeof x
    return t === STR
      ? isNaN(x - parseFloat(x)) ? STR : NUM
      : t === OBJ ? otype(x).toLowerCase() : t
  }
}





