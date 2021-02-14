'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var enumDataTypes = require('@typen/enum-data-types');

/**
 * Below values are parsed to false:
 * null, 0, undefined, empty string, empty array, object w/o length, object.length=0/null/undefined
 * 'false', 'False', 'no', 'None' ... any string starts with 'f','F','n','N'
 * @param {string|*} v
 * @returns {boolean}
 */

const bool = v => {
  var _v;

  if (!((_v = v) === null || _v === void 0 ? void 0 : _v.length)) return false;
  if (typeof v === enumDataTypes.STR) return (v = v[0].toLowerCase()) !== 'f' && v !== 'n';
  return Boolean(v);
};

exports.bool = bool;
