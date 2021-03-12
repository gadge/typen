'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');

const LITERAL = /[A-Za-z0-9]+/;
const HAN = /[\u4e00-\u9fa5]+|[\uff00-\uffff]+/;
const isLiteral = x => LITERAL.test(x);
const isHan = x => HAN.test(x);
const isString = x => typeof x === enumDataTypes.STR;
const isNumStr = x => {
  const t = typeof x;
  return t === enumDataTypes.STR || t === enumDataTypes.NUM;
};
const hasLiteral = x => isString(x) && isLiteral(x);
const hasHan = x => isString(x) && isHan(x);
const hasAlpHan = x => isString(x) && (isLiteral(x) || isHan(x));

exports.HAN = HAN;
exports.LITERAL = LITERAL;
exports.hasAlpHan = hasAlpHan;
exports.hasHan = hasHan;
exports.hasLiteral = hasLiteral;
exports.isHan = isHan;
exports.isLiteral = isLiteral;
exports.isNumStr = isNumStr;
exports.isString = isString;
