const miscs = {
  Boo_true: [true],
  Boo_false: [false],
  null: [null],
  undefined: [undefined],
}

const numerics = {
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

const strings = {
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

const arrays = {
  Arr_empty: [[]],
  Arr_zero: [[0]],
  Arr_one: [[1]],
  Arr_misc: [[16, 64, 128]]
}

export {
  miscs,
  numerics,
  strings,
  arrays
}