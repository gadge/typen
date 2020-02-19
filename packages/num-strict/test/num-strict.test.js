import { Chrono } from 'elprimero'
import { CrosTabX } from 'xbrief'
import { makeEmbedded } from '@foba/util'
import { Arrays, Numerics, Strings } from '@typen/foobar'
import { inferType, isNumeric, parseNum } from '../index'

const { lapse, result } = Chrono.strategies({
  repeat: 1E+5,
  paramsList: {
    ...Strings,
    ...Numerics,
    ...Arrays
  } |> makeEmbedded,
  funcList: {
    stable: x => x,
    isNumeric,
    parseNum,
    inferData: inferType
  }
})
'lapse' |> console.log
lapse |> CrosTabX.brief |> console.log
'' |> console.log
'result' |> console.log
result |> CrosTabX.brief |> console.log
