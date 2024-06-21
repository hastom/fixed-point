export const toPrecision = (base: bigint, to: bigint, from: bigint): bigint => {
  if (to === from) {
    return base
  }
  return base * (10n ** to) / (10n ** from)
}
export const min = (...args: bigint[]): bigint => args.reduce((m, e) => e < m ? e : m)
export const max = (...args: bigint[]): bigint => args.reduce((m, e) => e > m ? e : m)
export const abs = (arg: bigint): bigint => arg < 0n ? -arg : arg
