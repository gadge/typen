import { STR, NUM, OBJ } from '@typen/enum-data-types';
import { typ } from '@typen/typ';

const isNumeric = x => !!(x = +x) || x === 0;

/**
 *
 * @param {*} x
 * @return {string}
 */

const inferType = x => {
  const t = typeof x;
  return t === STR ? isNumeric(x) ? NUM : STR : t === OBJ ? typ(x) : t;
};

const parseNum = x => isNumeric(x) ? x : NaN;

export { inferType, isNumeric, parseNum };
