'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');
var typ = require('@typen/typ');

// Angular 4.3
const isNumeric = x => !isNaN(x - parseFloat(x));

const inferType = x => {
  const t = typeof x;
  return t === enumDataTypes.STR ? isNumeric(x) ? enumDataTypes.NUM : enumDataTypes.STR : t === enumDataTypes.OBJ ? typ.typ(x) : t;
};

/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */
const validate = (x, y) => isNaN(x - y) ? NaN : y;

const parseNum = x => validate(x, parseFloat(x));

exports.inferType = inferType;
exports.isNumeric = isNumeric;
exports.parseNum = parseNum;
