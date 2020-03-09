import { strategies } from '@valjoux/strategies'
import { decoCrostab, says } from '@spare/logger'
import { Basics } from '../../../reference/foobar'
import { makeEmbedded } from '@foba/util'

const basics = Basics
delete basics.bigint
export const PS = Object.prototype.toString

const protoType = Function.prototype.call.bind(Object.prototype.toString)

const { lapse, result } = strategies({
  repeat: 1E+7,
  candidates: Basics |> makeEmbedded,
  methods: {
    bench: x => x,
    stable: x => PS.call(x),
    edge: x => protoType(x).substring(8, -1),
    dev: x => PS.call(x).slice(8, -1),
    native: x => typeof x,
  }
})

lapse |> decoCrostab |> says['lapse']

result |> decoCrostab |> says['result']
