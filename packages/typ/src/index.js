export const OptS = Object.prototype.toString

/**
 * const rxObj = /^\[object (.*)]$/
 * Equivalent to: Object.prototype.stringify.call(o).match(rxObj)[1]
 * @param {*} o
 * @return {string}
 */
export const typ = o => OptS.call(o).slice(8, -1)
