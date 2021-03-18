import { logger }                      from '@spare/logger'
import { LITERAL_FULL, isLiteralFull } from '../src/literal'

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
  `[${key}] (${value}) [isHan] (${isLiteralFull(value)}) (${String(value).search(LITERAL_FULL)})` |> logger
}
