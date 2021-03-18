'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var regexCharset = require('@spare/regex-charset');
var enumDataTypes = require('@typen/enum-data-types');

const LITERAL_LOWER = `${regexCharset.HALF_UPPER}${regexCharset.HALF_LOWER}${regexCharset.HALF_NUM}`;
const LITERAL_UPPER = `${regexCharset.FULL_UPPER}${regexCharset.FULL_LOWER}${regexCharset.FULL_NUM}`;
const LITERAL = new RegExp(`[${LITERAL_LOWER}]+`); // LITERAL = /[A-Za-z0-9]+/

const LITERAL_FULL = new RegExp(`[${regexCharset.CJK_LETTERS}${LITERAL_UPPER}]+`); // HAN = /[\u4e00-\u9fbf]+|[\uff00-\uffff]+/

const LITERAL_ANY = new RegExp(`[${LITERAL_LOWER}${regexCharset.CJK_LETTERS}${LITERAL_UPPER}]+`);
const isString = x => typeof x === enumDataTypes.STR;
const isNumStr = x => {
  const t = typeof x;
  return t === enumDataTypes.STR || t === enumDataTypes.NUM;
};
const isLiteral = x => LITERAL.test(x);
const isLiteralFull = x => LITERAL_FULL.test(x);
const isLiteralAny = x => LITERAL_ANY.test(x);
const hasLiteral = x => isString(x) && isLiteral(x);
const hasLiteralFull = x => isString(x) && isLiteralFull(x);
const hasLiteralAny = x => isString(x) && isLiteralAny(x);

exports.LITERAL = LITERAL;
exports.LITERAL_ANY = LITERAL_ANY;
exports.LITERAL_FULL = LITERAL_FULL;
exports.hasAlpHan = hasLiteralAny;
exports.hasLiteral = hasLiteral;
exports.hasLiteralAny = hasLiteralAny;
exports.hasLiteralFull = hasLiteralFull;
exports.isLiteral = isLiteral;
exports.isLiteralAny = isLiteralAny;
exports.isLiteralFull = isLiteralFull;
exports.isNumStr = isNumStr;
exports.isString = isString;
