'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var enumTabularTypes = require('@typen/enum-tabular-types');
var inferType = require('@typen/infer-type');
var vectorMapper = require('@vect/vector-mapper');

const nullish = x => x === null || x === void 0;

/**
 *
 * @param {*[]} vec
 * @param {number} [l]
 * @returns {[any, any][]|[]|any[]|*}
 */

const inferTypes = function (vec, l) {
  var _this$inferType;

  const inferType$1 = (_this$inferType = this.inferType) !== null && _this$inferType !== void 0 ? _this$inferType : inferType.inferTypeNaive;
  const omitNull = this.omitNull;
  let o,
      nullType = null;
  const distinct = (l = vec === null || vec === void 0 ? void 0 : vec.length) === (l & 0x7f) ? (o = [], vectorMapper.iterate(vec, x => {
    if (omitNull && nullish(x)) nullType = x;else if (o.indexOf(x = inferType$1(x)) < 0) o.push(x);
  }, l), o) : (o = {}, vectorMapper.iterate(vec, x => {
    if (omitNull && nullish(x)) nullType = x;else if (!((x = inferType$1(x)) in o)) o[x] = void 0;
  }, l), Object.keys(o));
  return distinct.length ? distinct : [nullType];
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
  if (!(vec !== null && vec !== void 0 && vec.length)) return enumDataTypes.NUL;
  const config = this;
  const types = inferTypes.call(config, vec);
  if (types.length === 1) return types[0];
  if (types.length === 2 && types.includes(enumDataTypes.NUM) && types.includes(enumTabularTypes.NUMSTR)) return enumTabularTypes.NUMSTR;
  return enumTabularTypes.MISC;
}
/**
 *
 * @param {Object} config
 * @param {Function} [config.inferType]
 * @param {boolean} [config.omitNull]
 * @return Function
 */

const VectorType = (config = {}) => vectorType.bind(config);

exports.InferTypes = InferTypes;
exports.VectorType = VectorType;
exports.inferTypes = inferTypes;
exports.vectorType = vectorType;
