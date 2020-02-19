import { FobaNum as NumVecs, FobaStr as StrVecs } from '@foba/vector'
import { flop } from '@aryth/rand'

export const Basics = {
  null: null,
  undefined: undefined,
  boolean: false,
  number: 1024,
  numNaN: NaN,
  numInf: Number.POSITIVE_INFINITY,
  string: StrVecs.flop() |> flop,
  numStr: String(NumVecs.flop() |> flop),
  bigint: BigInt(9007199254740991),
}
