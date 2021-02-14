'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var typ = require('@typen/typ');
var numStrict = require('@typen/num-strict');

const inferTypeNaive = x => {
  const t = typeof x;
  return t === enumDataTypes.OBJ ? typ.typ(x) : t;
};

const inferType = function (x) {
  const {
    numstr,
    isNumeric
  } = this,
        t = typeof x;
  return t === enumDataTypes.STR ? isNumeric(x) ? numstr : enumDataTypes.STR : t === enumDataTypes.OBJ ? typ.typ(x) : t;
};
const InferType = ({
  isNumeric,
  numstr
} = {}) => {
  if (!isNumeric && !numstr) return inferTypeNaive;
  return inferType.bind({
    isNumeric: isNumeric !== null && isNumeric !== void 0 ? isNumeric : numStrict.isNumeric,
    numstr: numstr !== null && numstr !== void 0 ? numstr : NUM
  });
};

exports.InferType = InferType;
exports.inferType = inferType;
exports.inferTypeNaive = inferTypeNaive;
