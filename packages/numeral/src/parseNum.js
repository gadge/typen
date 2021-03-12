import { STR }   from '../../../reference/original'
import { COMMA } from './comma'


/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */
const validate = (x, y) => isNaN(x - y) ? NaN : y

export const parseNum = x => {
  if (typeof x === STR) x = x.replace(COMMA, '')
  return validate(x, parseFloat(x))
}
