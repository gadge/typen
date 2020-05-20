'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');

const LITERAL = /[A-Za-z0-9]+/g;
const isLiteral = x => LITERAL.test(x);
const isString = x => typeof x === enumDataTypes.STR;

exports.LITERAL = LITERAL;
exports.isLiteral = isLiteral;
exports.isString = isString;
