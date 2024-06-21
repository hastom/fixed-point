import { Base, FPParser, Numeric, Precision } from './types'
import { toPrecision } from './math'

import { FixedPoint } from './FixedPoint'

export const parsePrecision = (precision: Precision): bigint => {
  return BigInt(precision)
}

const parseDecimalString = (decimal: string): [bigint, bigint] => {
  const [i, d = ''] = decimal.split('.')
  const p = BigInt(d.length)
  return [BigInt(i) * (10n ** p) + BigInt(d), p]
}

const parseBase = (base: Base): [bigint, bigint] => {
  const baseString = base.toString()
  if (baseString.includes('e')) {
    const [i, pow] = baseString.split('e')
    const [b, p] = parseDecimalString(i)
    if (pow.startsWith('-')) {
      return [b, p + BigInt(-Number(pow))]
    } else {
      return [b * (10n ** (BigInt(Number(pow)) - p)), 0n]
    }
  } else if (baseString.includes('.')) {
    return parseDecimalString(baseString)
  } else {
    return [BigInt(baseString), 0n]
  }
}

export const parseNumeric = (numeric: Numeric, defaultPrecision?: Precision): [bigint, bigint] => {
  if (defaultPrecision && !Array.isArray(numeric)) {
    numeric = [numeric, defaultPrecision]
  }
  if (Array.isArray(numeric)) {
    const [base, precision] = parseBase(numeric[0])
    return [toPrecision(base, BigInt(numeric[1]), precision), BigInt(numeric[1])]
  } else {
    return parseBase(numeric)
  }
}

export const FP: FPParser = <T extends typeof FixedPoint = typeof FixedPoint>(
  numeric: FixedPoint | Numeric, defaultPrecision?: Precision,
): FixedPoint => {
  if (numeric instanceof FixedPoint) {
    return numeric as InstanceType<T>
  }
  return new FixedPoint(...parseNumeric(numeric, defaultPrecision))
}
