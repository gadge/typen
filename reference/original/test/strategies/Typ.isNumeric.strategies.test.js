import { Chrono } from 'elprimero'
import { printChronoCross } from '../util/printChronoCross'
import { Hatsu } from 'hatsu'
import { Palett } from 'palett'

const
  repeat = 300000,
  getPipeline = (paramsList) => result => result
    .map(it => it || (it |> Hatsu.hex(Palett.red.base)))
    .unshiftCol('[p.Float]', Object.values(paramsList).map(([x]) => parseFloat(x)))
    .unshiftCol('[+x]', Object.values(paramsList).map(([x]) => +x))
    .unshiftCol('[Num]', Object.values(paramsList).map(([x]) => Number(x)))

const
  isNumber = (x) => typeof x === 'number',
  notNaN = (x) => !isNaN(x),
  isNaN_ad = (x) => !(+x),
  notNaN_ad = (x) => !!(+x),
  stable = (x) => !!(+x) || parseInt(x) === 0,
  edge = x => {
    if (x === '') return false
    x = +x
    return !!x || x === 0
  },
  dev = (x) => {
    const n = parseFloat(x)
    return !!n || n === 0
  },
  angular = (x) => !isNaN(x - parseFloat(x)),
  hamzeen = (x) => !isNaN(parseFloat(x)) && isFinite(x)

export class TypInferNumStrStrategiesTest {
  static testMisc = () => {
    const paramsList = {
      Boo_true: [true],
      Boo_false: [false],
      null: [null],
      undefined: [undefined],
    }
    const funcList = {
      _typeof: isNumber,
      notNaN,
      notNaN_ad,
      angular,
      hamzeen,
    }
    const { lapse, result } = Chrono.strategies({ repeat, paramsList, funcList })
    printChronoCross({ lapse, result, pipeline: getPipeline(paramsList) })
  }

  static testNumeric = () => {
    const paramsList = {
      Num_zero: [0],
      Num_one: [1],
      Num_frac: [.42],
      Num_positive: [1024],
      Num_negative: [-1024],
      Num_EPSILON: [Number.EPSILON],
      Num_NaN: [Number.NaN],
      Num_POS_INF: [Number.POSITIVE_INFINITY],
      Num_NEG_INF: [Number.NEGATIVE_INFINITY],
    }
    const funcList = {
      notNaN,
      angular,
      hamzeen,
      hamzeen_dev: x => !isNaN(x) && isFinite(x),
      angular_dev: dev
    }
    const { lapse, result } = Chrono.strategies({ repeat, paramsList, funcList })
    printChronoCross({ lapse, result, pipeline: getPipeline(paramsList) })
  }

  static testString = () => {
    const paramsList =
      {

        'Str: 0': ['0'],
        'Str: -1': ['-1'],
        'Str: -1.5': ['-1.5'],
        'Str: 0.42': ['0.42'],
        'Str: .42': ['.42'],
        'Str: 1.2E+9': ['1.2E+9'],
        'Str: 0xFF': ['0xFF'],
        'Str: Inf..': ['Infinity'],
        'Str: empty': [''],
        'Str: space': [' '],
        'Str: NaN': ['NaN'],
        'Str: null': [null],
        'Str: undefined': [undefined],
        'Str: true': [true],
        'Str: false': [false],
        'Str: [o Obj]': ['[object Object]'],
        'Str: dot': ['.'],
        'Str: +': ['+'],
        'Str: -': ['-'],
        'Str: 99,999': ['99,999'],
        'Str: date': ['2077-06-04'],
        'Str: #abcdef': ['#abcdef'],
        'Str: 1.2.3': ['1.2.3'],
        'Str: blah': ['blah'],
      }
    const funcList = {
      numify_stable: x => hamzeen(x) ? parseFloat(x) : NaN,
      numify_edge: x => {
        let y
        switch (typeof x) {
          case 'string':
            y = parseFloat(x)
          case 'number':
            y = x
            return isNaN(x - y) ? NaN : y
          default:
            return NaN
        }
        // const y = parseFloat(x)
        // return isNaN(x - y) ? NaN : y
      },
      numify_dev: x => {
        switch (typeof x) {
          case 'string':
            // if (x.trim() === '') return NaN
            x = +x
            if (x === 0) return x
            if (!(x)) {
              return NaN
            }
            x = parseFloat(x)
          case 'number':
            return !isNaN(x - x) ? x : NaN
          default:
            return NaN
        }
      },
      isNaN,
      notNaN,
      isNaN_ad,
      notNaN_ad,
      stable,
      edge,
      dev,
      angular,
      hamzeen,
    }
    const { lapse, result } = Chrono.strategies({ repeat, paramsList, funcList })
    printChronoCross({ lapse, result, pipeline: getPipeline(paramsList) })
  }

  static
  testArr = () => {
    const paramsList = {
      Arr_empty: [[]],
      Arr_zero: [[0]],
      Arr_one: [[1]],
      Arr_misc: [[16, 64, 128]]
    }
    const funcList = {
      _typeof: isNumber,
      notNaN,
      notNaN_ad,
      stable,
      angular,
      hamzeen,
    }
    const { lapse, result } = Chrono.strategies({ repeat, paramsList, funcList })
    printChronoCross({ lapse, result, pipeline: getPipeline(paramsList) })
  }
}

describe('Typ Infer Num Str Strategies Test', function () {
    this.timeout(1000 * 60)
    it('Typ Infer Num Str Strategies Test: test Misc ', () => {
      TypInferNumStrStrategiesTest.testMisc()
    })
    it('Typ Infer Num Str Strategies Test: test Numeric ', () => {
      TypInferNumStrStrategiesTest.testNumeric()
    })
    it('Typ Infer Num Str Strategies Test: test String ', () => {
      TypInferNumStrStrategiesTest.testString()
    })
    it('Typ Infer Num Str Strategies Test: test Arr ', () => {
      TypInferNumStrStrategiesTest.testArr()
    })
  }
)
