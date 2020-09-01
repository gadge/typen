'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');

const LITERAL = /[A-Za-z0-9]+/;
const isLiteral = x => LITERAL.test(x);
const isString = x => typeof x === enumDataTypes.STR;
const isNumStr = x => {
  const t = typeof x;
  return t === enumDataTypes.STR || t === enumDataTypes.NUM;
};
const hasLiteral = x => isString(x) && isLiteral(x);

exports.LITERAL = LITERAL;
exports.hasLiteral = hasLiteral;
exports.isLiteral = isLiteral;
exports.isNumStr = isNumStr;
exports.isString = isString;
