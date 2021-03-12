import { makeEmbedded }        from '@foba/util'
import { decoCrostab, logger } from '@spare/logger'
import { strategies }          from '@valjoux/strategies'

import { inferType, isNumeric, parseNum } from '../index'
import { Arrays, Numerics, Strings }      from './foobar'

const { lapse, result } = strategies({
  repeat: 1E+5,
  candidates: {
    ...Strings,
    ...Numerics,
    ...Arrays
  } |> makeEmbedded,
  methods: {
    stable: x => x,
    isNumeric,
    parseNum,
    inferType
  }
})
'lapse' |> console.log

lapse |> decoCrostab |> logger
'' |> console.log
'result' |> console.log
result |> decoCrostab |> logger


