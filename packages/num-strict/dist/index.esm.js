import { STR, NUM, OBJ } from '@typen/enum-data-types';
import { typ } from '@typen/typ';

// Angular 4.3
const isNumeric = x => !isNaN(x - parseFloat(x));

const inferType = x => {
  const t = typeof x;
  return t === STR ? isNumeric(x) ? NUM : STR : t === OBJ ? typ(x) : t;
};

/**
 * validate
 * @param x
 * @param y
 * @returns {number}
 */
const validate = (x, y) => isNaN(x - y) ? NaN : y;

const parseNum = x => validate(x, parseFloat(x));

export { inferType, isNumeric, parseNum };
