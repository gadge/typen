import { STR } from '@typen/enum-data-types'

/**
 * Below values are parsed to false:
 * null, 0, undefined, empty string, empty array, object w/o length, object.length=0/null/undefined
 * 'false', 'False', 'no', 'None' ... any string starts with 'f','F','n','N'
 * @param {string|*} v
 * @returns {boolean}
 */
export const bool = v => {
  if (!v?.length) return false
  if (typeof v === STR) return (v = v[0].toLowerCase()) !== 'f' && v !== 'n'
  return Boolean(v)
}
