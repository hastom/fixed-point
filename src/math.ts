const pow10Cache: bigint[] = [1n]

export const pow10 = (exp: bigint): bigint => {
  const idx = Number(exp)
  let val = pow10Cache[idx]
  if (val === undefined) {
    val = 10n ** exp
    pow10Cache[idx] = val
  }
  return val
}

export const toPrecision = (base: bigint, to: bigint, from: bigint): bigint => {
  if (to === from) {
    return base
  }
  if (to > from) {
    return base * pow10(to - from)
  }
  return base / pow10(from - to)
}

export const min2 = (a: bigint, b: bigint): bigint => a < b ? a : b
export const max2 = (a: bigint, b: bigint): bigint => a > b ? a : b
export const min = (...args: bigint[]): bigint => args.reduce((m, e) => e < m ? e : m)
export const max = (...args: bigint[]): bigint => args.reduce((m, e) => e > m ? e : m)
export const abs = (arg: bigint): bigint => arg < 0n ? -arg : arg
