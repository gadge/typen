import { STR }   from '../../../reference/original'
import { COMMA } from './comma'

// Angular 4.3
export const isNumeric = x => {
  if (typeof x === STR) x = x.replace(COMMA, '')
  return !isNaN(x - parseFloat(x))
}









