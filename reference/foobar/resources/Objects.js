import { FobaStr as StrVecs } from '@foba/vector'
import { FobaNum as NumObs, FobaStr as StrObs } from '@foba/object'

export const Objects = {
  array: StrVecs.flop(),
  map: new Map(Object.entries(NumObs.flop())),
  set: new Set(StrVecs.flop()),
  object: StrObs.flop(),
  function: x => console.log(x),
}
