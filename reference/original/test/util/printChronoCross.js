import { Stat } from 'borel'
import { CrosTabX } from 'xbrief'
import { logNeL } from 'palma'

/**
 *
 * @param {CrosTab} lapse
 * @param {CrosTab} result
 * @param {function(CrosTab):CrosTab} [pipeline]
 */
export const printChronoCross = ({ lapse, result, pipeline }) => {
  'lapse' |> console.log
  lapse |> CrosTabX.brief |> logNeL
  'result' |> console.log
  if (!!pipeline) result = result |> pipeline
  result
    .brief({ansi:true})
    |> console.log
  '' |> console.log
}
