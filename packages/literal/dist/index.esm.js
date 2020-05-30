import { STR } from '@typen/enum-data-types';

const LITERAL = /[A-Za-z0-9]+/;
const isLiteral = x => LITERAL.test(x);
const isString = x => typeof x === STR;
const hasLiteral = x => isString(x) && isLiteral(x);

export { LITERAL, hasLiteral, isLiteral, isString };
