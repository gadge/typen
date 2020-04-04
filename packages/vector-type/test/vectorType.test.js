import { NumberVectorCollection, StringVectorCollection } from '@foba/vector'
import { says, xr } from '@spare/logger'
import { deco } from '@spare/deco'
import { VectorType } from '../src/vectorType'
import { InferType } from '@typen/infer-type'
import { isNumeric } from '@typen/num-strict'
import { NUM } from '@typen/enum-data-types'

const mixed = NumberVectorCollection.flopShuffle({})
mixed[1] = mixed[1].toString()
const candidates = Object.assign({ mixed },
  NumberVectorCollection.flopShuffle({ keyed: true }),
  StringVectorCollection.flopShuffle({ keyed: true }),
)

const vecType = VectorType(InferType({ isNumeric: isNumeric, numstr: NUM }))
for (const [key, vec] of Object.entries(candidates)) {
  xr().elements(vec |> deco).type(vecType(vec)) |> says[key]
}
