/**
 *
 * @type {Function|function(*):string}
 */
export const protoType = Function.prototype.call.bind(Object.prototype.toString)

/**
 * const rxObj = /^\[object (.*)]$/
 * Equivalent to: Object.prototype.stringify.call(o).match(rxObj)[1]
 * @param {*} o
 * @return {string}
 */
export const typ = o => protoType(o).substring(8, -1)
