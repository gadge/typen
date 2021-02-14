export const sobrief = x => {
  x = typeof x === 'function'
    ? String(x)
      .replace(/\s/g, '')
      .replace('{return', '{ => ')
      .replace('generator', '* ')
      .slice(8, 27)
    : String(x).slice(0, 18)
  return x.length < 18 ? x : x + '...'
}
