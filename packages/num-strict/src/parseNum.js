/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */
const validate = (x, y) => isNaN(x - y) ? NaN : y

export const parseNum = x => validate(x, parseFloat(x))
