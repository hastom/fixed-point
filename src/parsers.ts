import { FixedPoint } from './FixedPoint'
import { toPrecision } from './math'

const pow10 = (base: bigint, exp: bigint) => base * (10n ** exp)

const numberToDecimalString = (src: number, precision: number): string => {
  if (!Number.isFinite(src)) {
    throw Error(`Invalid number: ${src}`)
  }
  let result: string
  if (Math.log10(src) <= 6) {
    result = src.toLocaleString('en', { minimumFractionDigits: precision, useGrouping: false })
  } else if (src - Math.trunc(src) === 0) {
    result = src.toLocaleString('en', { maximumFractionDigits: 0, useGrouping: false })
  } else {
    throw Error('Not enough precision for a number value. Use string value instead')
  }
  return result
}

export const fpFromDecimal = (src: number | string | bigint, dstPrecision: number): FixedPoint => {
  const _dstPrecision = BigInt(dstPrecision)
  if (typeof src === 'bigint') {
    return new FixedPoint(pow10(src, _dstPrecision), _dstPrecision)
  }
  let decimalString = typeof src === 'number' ? numberToDecimalString(src, dstPrecision) : src

  // Check sign
  let isNegative = false
  while (decimalString.startsWith('-')) {
    isNegative = !isNegative
    decimalString = decimalString.slice(1)
  }

  // Split string
  if (decimalString === '.') {
    throw Error(`Invalid number: ${src}`)
  }
  const parts = decimalString.split('.')
  if (parts.length > 2) {
    throw Error(`Invalid number: ${src}`)
  }

  // Prepare parts
  let whole = parts[0]
  let frac = parts[1]
  if (!whole) {
    whole = '0'
  }
  if (!frac) {
    frac = '0'
  }
  if (frac.length > dstPrecision) {
    frac = frac.slice(0, dstPrecision)
  }
  frac = frac.padEnd(dstPrecision, '0')

  // Convert
  let base = pow10(BigInt(whole), _dstPrecision) + BigInt(frac)
  if (isNegative) {
    base = -base
  }

  return new FixedPoint(base, _dstPrecision)
}

export const fpFromInt = (src: number | string | bigint, srcPrecision: number, dstPrecision: number): FixedPoint => {
  const _srcPrecision = BigInt(srcPrecision)
  const _dstPrecision = BigInt(dstPrecision)
  return new FixedPoint(toPrecision(BigInt(src), _dstPrecision, _srcPrecision), _dstPrecision)
}
