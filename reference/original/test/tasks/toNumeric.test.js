import { Num } from '../..'
import { NumLoose } from '../../src/numLoose'
import { Chrono } from 'elprimero'
import { arrays, miscs, numerics, strings } from '../assets/samples.list'

const { numeric: toNum } = Num
const { numeric: toNumL } = NumLoose

export class ToNumericTest {
  static test () {
    const { lapse, result } = Chrono.crossByParamsAndFuncs({
      repeat: 1E+6,
      paramsList: {
        ...miscs,
        ...numerics,
        ...strings,
        ...arrays
      },
      funcList: {
        _Num: toNum,
        _parseFloat: x => parseFloat(x),
        _NumL: toNumL,
        _plus: x => +x,
        _Number: x => Number(x)
      }
    })
    'lapse' |> console.log
    lapse.brief() |> console.log
    '' |> console.log
    'result' |> console.log
    result.brief() |> console.log
  }
}

describe('Numeric Transfer Strategies', function () {
  this.timeout(1000 * 60)
  it('Numeric Transfer Strategies: test ', () => {
    ToNumericTest.test()
  })
})
