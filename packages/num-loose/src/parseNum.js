import { isNumeric } from './isNumeric'

export const parseNum = x => isNumeric(x) ? x : NaN
