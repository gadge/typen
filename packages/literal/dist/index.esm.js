import { STR, NUM } from '@typen/enum-data-types';

const LITERAL = /[A-Za-z0-9]+/;
const HAN = /[\u4e00-\u9fa5]+|[\uff00-\uffff]+/;
const isLiteral = x => LITERAL.test(x);
const isHan = x => HAN.test(x);
const isString = x => typeof x === STR;
const isNumStr = x => {
  const t = typeof x;
  return t === STR || t === NUM;
};
const hasLiteral = x => isString(x) && isLiteral(x);
const hasHan = x => isString(x) && isHan(x);
const hasAlpAndHan = x => isString(x) && isLiteral(x) && isHan();

export { HAN, LITERAL, hasAlpAndHan, hasHan, hasLiteral, isHan, isLiteral, isNumStr, isString };
