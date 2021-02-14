import { NumberVectorCollection, StringVectorCollection } from '@foba/vector'
import { says, xr } from '@spare/logger'
import { deco } from '@spare/deco'
import { VectorType } from '../src/vectorType'
import { InferType } from '@typen/infer-type'
import { isNumeric } from '@typen/num-strict'
import { NUM } from '@typen/enum-data-types'

const mixedAlpha = NumberVectorCollection.flopShuffle({})
const mixedBeta = NumberVectorCollection.flopShuffle({})

mixedAlpha[1] = mixedAlpha[1].toString()
mixedAlpha[mixedBeta.length - 1] = null
mixedBeta[1] = null
mixedBeta[mixedBeta.length - 1] = undefined
const empty = []

const candidates = Object.assign({ empty, mixedAlpha, mixedBeta },
  NumberVectorCollection.flopShuffle({ keyed: true }),
  StringVectorCollection.flopShuffle({ keyed: true }),
)

const vecType = VectorType({ inferType: InferType({ isNumeric: isNumeric, numstr: NUM }), omitNull: true })
for (const [key, vec] of Object.entries(candidates)) {
  xr().elements(vec |> deco).type(vecType(vec)) |> says[key]
}
