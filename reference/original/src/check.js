import { oc } from '../utils/typen'

/**
 *
 * @param x
 * @return {{
 * typeOf: ("undefined"|"object"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"),
 * protoType: *,
 * stringify: string
 * }}
 */
export let check = x => ({
  value: x,
  typeOf: typeof x,
  protoType: oc.call(x),
  stringify: `${x}`,
})
