import { logger }             from '@spare/logger'
import { isLiteral, LITERAL } from '../src/literal'

const candidates = {
  und: undefined,
  nul: null,
  word: 'foo',
  num: 256,
  arr: [],
  obj: {}
}

for (const [key, value] of Object.entries(candidates)) {
  `[${key}] (${value}) [isLiteral] (${isLiteral(value)}) (${String(value).search(LITERAL)})` |> logger
}
