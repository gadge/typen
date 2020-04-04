import { OBJECT } from '@typen/enums'
import { Chrono } from 'elprimero'
import { CrosTabX } from 'xbrief'
import { makeEmbedded } from '@foba/util'
import { Basics, Objects } from '@typen/foobar'
import { mapper } from '@vect/object-mapper'
import { logger } from '@spare/logger'
import { sobrief } from './sobrief'

const oc = Object.prototype.toString

const candidates = { ...Basics, ...Objects } |> makeEmbedded
const voidArgs = []
const rxObj = /^\[object (.*)]$/

export class ObjectTypeTest {
  static test () {
    const { lapse, result } = Chrono.strategies(
      {
        repeat: 1e+5,
        paramsList: candidates,
        funcList: {
          type_of: x => typeof x,
          prototyped: x => Object.prototype.toString.call(x),
          reflected: x => Reflect.apply(oc, x, voidArgs),
          protoReg: x => Object.prototype.toString.call(x).match(rxObj)[1],
          initial: x => oc.call(x).slice(8, 11),
          infer: o => {
            const t = typeof o
            return t === OBJECT ? oc.call(o).slice(8, -1) : t
          },
        }
      }
    )
    'lapse' |> logger
    lapse |> CrosTabX.brief |> logger
    '' |> logger
    'result' |> logger
    result
      .unshiftCol('brief', Object.values(mapper(candidates, args => sobrief.apply(null, args))))
      |> CrosTabX.brief
      |> logger
  }
}

ObjectTypeTest.test()
