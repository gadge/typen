'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var typ = require('@typen/typ');

const isNumeric = x => (x = +x) || x === 0;

/**
 *
 * @param {*} x
 * @return {string}
 */

const inferType = x => {
  const t = typeof x;
  return t === enumDataTypes.STR ? isNumeric(x) ? enumDataTypes.NUM : enumDataTypes.STR : t === enumDataTypes.OBJ ? typ.typ(x) : t;
};

const parseNum = x => isNumeric(x) ? x : NaN;

exports.inferType = inferType;
exports.isNumeric = isNumeric;
exports.parseNum = parseNum;
