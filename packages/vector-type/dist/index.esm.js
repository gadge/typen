import { NUL, NUM } from '@typen/enum-data-types';
import { NUMSTR, MISC } from '@typen/enum-tabular-types';
import { iterate } from '@vect/vector-mapper';
import { inferTypeNaive } from '@typen/infer-type';

/**
 *
 * @param {*[]} vec
 * @param {number} [l]
 * @returns {[any, any][]|[]|any[]|*}
 */

const inferTypes = function (vec, l) {
  var _this$inferType;

  const inferType = (_this$inferType = this.inferType) !== null && _this$inferType !== void 0 ? _this$inferType : inferTypeNaive;
  const omitNull = this.omitNull;
  let o,
      nullish = null;
  const distinct = (l = vec === null || vec === void 0 ? void 0 : vec.length) === (l & 0x7f) ? (o = [], iterate(vec, x => {
    if (omitNull && (x === null || x === void 0)) {
      nullish = x;
    } else if (o.indexOf(x = inferType(x)) < 0) {
      o.push(x);
    }
  }, l), o) : (o = {}, iterate(vec, x => {
    if (omitNull && (x === null || x === void 0)) {
      nullish = x;
    } else if (!((x = inferType(x)) in o)) {
      o[x] = void 0;
    }
  }, l), Object.keys(o));
  return distinct.length ? distinct : [nullish];
};
/**
 *
 * @param {Object} config
 * @param {Function} [config.inferType]
 * @param {boolean} [config.omitNull]
 * @return Function
 */

const InferTypes = config => {
  return inferTypes.bind(config);
};

/**
 *
 * @param {*[]} vec
 * @return {string|unknown}
 */

function vectorType(vec) {
  if (!(vec === null || vec === void 0 ? void 0 : vec.length)) return NUL;
  const config = this;
  const types = inferTypes.call(config, vec);
  if (types.length === 1) return types[0];
  if (types.length === 2 && types.includes(NUM) && types.includes(NUMSTR)) return NUMSTR;
  return MISC;
}
/**
 *
 * @param {Object} config
 * @param {Function} [config.inferType]
 * @param {boolean} [config.omitNull]
 * @return Function
 */

const VectorType = (config = {}) => {
  return vectorType.bind(config);
};

export { InferTypes, VectorType, inferTypes, vectorType };
