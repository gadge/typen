'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var typ = require('@typen/typ');

const STR = 'string';

const COMMA = /,/g;

const isNumeric = x => {
  if (typeof x === STR) x = x.replace(COMMA, '');
  return !isNaN(x - parseFloat(x));
};

const inferType = x => {
  const t = typeof x;
  return t === enumDataTypes.STR ? isNumeric(x.replace(COMMA, '')) ? enumDataTypes.NUM : enumDataTypes.STR : t === enumDataTypes.OBJ ? typ.typ(x) : t;
};

/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */

const validate = (x, y) => isNaN(x - y) ? NaN : y;

const parseNum = x => {
  if (typeof x === STR) x = x.replace(COMMA, '');
  return validate(x, parseFloat(x));
};

exports.inferType = inferType;
exports.isNumeric = isNumeric;
exports.parseNum = parseNum;
