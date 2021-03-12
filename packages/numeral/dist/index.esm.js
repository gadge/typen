import { STR as STR$1, NUM, OBJ } from '@typen/enum-data-types';
import { typ } from '@typen/typ';

const STR = 'string';

const COMMA = /,/g;

const isNumeric = x => {
  if (typeof x === STR) x = x.replace(COMMA, '');
  return !isNaN(x - parseFloat(x));
};

const inferType = x => {
  const t = typeof x;
  return t === STR$1 ? isNumeric(x.replace(COMMA, '')) ? NUM : STR$1 : t === OBJ ? typ(x) : t;
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

export { inferType, isNumeric, parseNum };
