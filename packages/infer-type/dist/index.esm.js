import { OBJ, STR } from '@typen/enum-data-types';
import { typ } from '@typen/typ';
import { isNumeric } from '@typen/num-strict';

const inferTypeNaive = x => {
  const t = typeof x;
  return t === OBJ ? typ(x) : t;
};

const inferType = function (x) {
  const {
    numstr,
    isNumeric
  } = this,
        t = typeof x;
  return t === STR ? isNumeric(x) ? numstr : STR : t === OBJ ? typ(x) : t;
};
const InferType = ({
  isNumeric: isNumeric$1,
  numstr
} = {}) => {
  if (!isNumeric$1 && !numstr) return inferTypeNaive;
  return inferType.bind({
    isNumeric: isNumeric$1 !== null && isNumeric$1 !== void 0 ? isNumeric$1 : isNumeric,
    numstr: numstr !== null && numstr !== void 0 ? numstr : NUM
  });
};

export { InferType, inferType, inferTypeNaive };
