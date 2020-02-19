import { Ob } from 'veho'
import { logger } from 'palma'

const samples = {
  null: null,
  undefined: undefined,
  boolean: false,
  number: 1024,
  numNaN: NaN,
  numInf: Number.POSITIVE_INFINITY,
  bigint: BigInt(9007199254740991),
  string: 'Shakespeare',
  stringBeta: String('Porter'),
  numStr: '-1024.2048',
  function: x => console.log(x),
  array: [1, 2, 3, 4, 5],
  map: new Map([['foo', 'bar']]),
  set: new Set([0, 0, 0, 1, 1, 2]),
  object: {},
  weakMap: new WeakMap(),
  weakSet: new WeakSet(),
  regExp: /-/g,
}

for (let [k, v] of Object.entries(samples)) {
  `[${k}] (${typeof v})` |> logger
}
