import { logger }     from '@spare/logger'
import { HAN, isHan } from '../src/literal'

const candidates = {
  und: undefined,
  nul: null,
  word: 'foo',
  han: '文森特·梵高,Vincent van Gogh',
  num: 256,
  arr: [],
  obj: {}
}

for (const [key, value] of Object.entries(candidates)) {
  `[${key}] (${value}) [isHan] (${isHan(value)}) (${String(value).search(HAN)})` |> logger
}
