import { iterate } from '@vect/vector-mapper'
import { inferTypeNaive } from '@typen/infer-type'

export const InferTypes = (inferType) => {
  return inferTypes.bind(inferType)
}

/**
 *
 * @param {*[]} vec
 * @param {number} [l]
 * @returns {[any, any][]|[]|any[]|*}
 */
export const inferTypes = function (vec, l) {
  const typ = this.inferType ?? inferTypeNaive
  const { omitNull } = this
  let o, nullish = null
  const distinct = (l = vec?.length) === (l & 0x7f)
    ? (o = [], iterate(vec, x => {
      if (omitNull && (x === null || x === void 0)) { nullish = x }
      else if (o.indexOf(x = typ(x)) < 0) { o.push(x) }
    }, l), o)
    : (o = {}, iterate(vec, x => {
      if (omitNull && (x === null || x === void 0)) { nullish = x }
      else if (!((x = typ(x)) in o)) { o[x] = void 0 }
    }, l), Object.keys(o))
  return distinct.length ? distinct : [nullish]
}

const mapDistinctV = function (fn, x) {
  if (this.indexOf(x = fn(x)) < 0) this.push(x)
}

const mapDistinctO = function (fn, x) {
  if (!((x = fn(x)) in this)) this[x] = void 0
}
