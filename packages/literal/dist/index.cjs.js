'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');

const LITERAL = /[A-Za-z0-9]+/;
const isLiteral = x => LITERAL.test(x);
const isString = x => typeof x === enumDataTypes.STR;
const hasLiteral = x => isString(x) && isLiteral(x);

exports.LITERAL = LITERAL;
exports.hasLiteral = hasLiteral;
exports.isLiteral = isLiteral;
exports.isString = isString;
