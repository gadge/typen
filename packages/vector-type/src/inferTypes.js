import { inferTypeNaive } from '@typen/infer-type'
import { nullish }        from '@typen/nullish'
import { iterate }        from '@vect/vector-mapper'

/**
 *
 * @param {*[]} vec
 * @param {number} [l]
 * @returns {[any, any][]|[]|any[]|*}
 */
export const inferTypes = function (vec, l) {
  const inferType = this.inferType ?? inferTypeNaive
  const omitNull = this.omitNull
  let o, nullType = null
  const distinct = (l = vec?.length) === (l & 0x7f)
    ? (o = [], iterate(vec, x => {
      if (omitNull && nullish(x)) nullType = x
      else if (o.indexOf(x = inferType(x)) < 0) o.push(x)
    }, l), o)
    : (o = {}, iterate(vec, x => {
      if (omitNull && nullish(x)) nullType = x
      else if (!((x = inferType(x)) in o)) o[x] = void 0
    }, l), Object.keys(o))
  return distinct.length ? distinct : [nullType]
}

/**
 *
 * @param {Object} config
 * @param {Function} [config.inferType]
 * @param {boolean} [config.omitNull]
 * @return Function
 */
export const InferTypes = (config) => {
  return inferTypes.bind(config)
}

const mapDistinctV = function (fn, x) {
  if (this.indexOf(x = fn(x)) < 0) this.push(x)
}

const mapDistinctO = function (fn, x) {
  if (!((x = fn(x)) in this)) this[x] = void 0
}
