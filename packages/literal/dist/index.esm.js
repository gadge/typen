import { CJK_LETTERS, HALF_UPPER, HALF_LOWER, HALF_NUM, FULL_UPPER, FULL_LOWER, FULL_NUM } from '@spare/regex-charset';
import { STR, NUM } from '@typen/enum-data-types';

const LITERAL_LOWER = `${HALF_UPPER}${HALF_LOWER}${HALF_NUM}`;
const LITERAL_UPPER = `${FULL_UPPER}${FULL_LOWER}${FULL_NUM}`;
const LITERAL = new RegExp(`[${LITERAL_LOWER}]+`); // LITERAL = /[A-Za-z0-9]+/

const LITERAL_FULL = new RegExp(`[${CJK_LETTERS}${LITERAL_UPPER}]+`); // HAN = /[\u4e00-\u9fbf]+|[\uff00-\uffff]+/

const LITERAL_ANY = new RegExp(`[${LITERAL_LOWER}${CJK_LETTERS}${LITERAL_UPPER}]+`);
const isString = x => typeof x === STR;
const isNumStr = x => {
  const t = typeof x;
  return t === STR || t === NUM;
};
const isLiteral = x => LITERAL.test(x);
const isLiteralFull = x => LITERAL_FULL.test(x);
const isLiteralAny = x => LITERAL_ANY.test(x);
const hasLiteral = x => isString(x) && isLiteral(x);
const hasLiteralFull = x => isString(x) && isLiteralFull(x);
const hasLiteralAny = x => isString(x) && isLiteralAny(x);

export { LITERAL, LITERAL_ANY, LITERAL_FULL, hasLiteralAny as hasAlpHan, hasLiteral, hasLiteralAny, hasLiteralFull, isLiteral, isLiteralAny, isLiteralFull, isNumStr, isString };
