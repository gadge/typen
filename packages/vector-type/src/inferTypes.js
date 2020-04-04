import { iterate } from '@vect/vector-mapper'
import { inferType as inferTypeStrict } from '@typen/num-strict'

export const InferTypes = (inferFn) => {
  return inferTypes.bind(inferFn)
}

/**
 *
 * @param {*[]} vec
 * @param {number} [l]
 * @returns {[any, any][]|[]|any[]|*}
 */
export const inferTypes = function (vec, l) {
  const inferFn = this ?? inferTypeStrict
  let o
  return (l = vec?.length) === (l & 0x7f)
    ? (o = [], iterate(vec, mapDistinctV.bind(o, inferFn), l), o)
    : (o = {}, iterate(vec, mapDistinctO.bind(o, inferFn), l), Object.keys(o))
}

const mapDistinctV = function (fn, x) {
  if (this.indexOf(x = fn(x)) < 0) this.push(x)
}

const mapDistinctO = function (fn, x) {
  if (!((x = fn(x)) in this)) this[x] = void 0
}
