/* eslint-disable @typescript-eslint/no-explicit-any */
import { abs, max, min, toPrecision } from './math'

export enum Rounding {
  /**
   * Rounds away from zero
   * Example: 1.5 -> 2, -1.5 -> -2
   */
  ROUND_UP,

  /**
   * Rounds towards zero
   * Example: 1.5 -> 1, -1.5 -> -1
   */
  ROUND_DOWN,

  /**
   * Rounds towards Infinity
   * Example: 1.5 -> 2, -1.5 -> -1
   */
  ROUND_CEIL,

  /**
   * Rounds towards -Infinity
   * Example: 1.5 -> 1, -1.5 -> -2
   */
  ROUND_FLOOR,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds away from zero
   * Example: 1.5 -> 2, -1.5 -> -2
   */
  ROUND_HALF_UP,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards zero
   * Example: 1.5 -> 1, -1.5 -> -1
   */
  ROUND_HALF_DOWN,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards even neighbour
   * Example: 1.5 -> 2, 2.5 -> 2
   */
  ROUND_HALF_EVEN,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards Infinity
   * Example: 1.5 -> 2, -1.5 -> -1
   */
  ROUND_HALF_CEIL,

  /**
   * Rounds towards nearest neighbour.
   * If equidistant, rounds towards -Infinity
   * Example: 1.5 -> 1, -1.5 -> -2
   */
  ROUND_HALF_FLOOR
}

export enum Decimals {
  left = 'left',
  right = 'right',
  min = 'min',
  max = 'max',
  add = 'add',
  sub = 'sub'
}

export type PrecisionResolution = Decimals | number | bigint

const pickPrecision = (
  aPrecision: bigint,
  bPrecision: bigint,
  precisionResolution: PrecisionResolution,
): bigint => {
  if (typeof precisionResolution !== 'string') {
    return BigInt(precisionResolution)
  }
  switch (precisionResolution) {
    case Decimals.left:
      return aPrecision
    case Decimals.right:
      return bPrecision
    case Decimals.min:
      return min(aPrecision, bPrecision)
    case Decimals.max:
      return max(aPrecision, bPrecision)
    case Decimals.add:
      return aPrecision + bPrecision
    case Decimals.sub:
      return max(aPrecision, bPrecision) - min(aPrecision, bPrecision)
  }
}

export class FixedPoint {

  static min(arg0: FixedPoint, ...args: FixedPoint[]): FixedPoint {
    let min = arg0
    for (const arg of args) {
      if (arg.lt(min)) {
        min = arg
      }
    }
    return min
  }

  static max(arg0: FixedPoint, ...args: FixedPoint[]): FixedPoint {
    let max = arg0
    for (const arg of args) {
      if (arg.gt(max)) {
        max = arg
      }
    }
    return max
  }

  private _base: bigint

  private _precision: bigint

  constructor(base: bigint, precision: bigint) {
    this._base = base
    this._precision = precision
  }

  get base() {
    return this._base
  }

  get precision() {
    return this._precision
  }

  add(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = max(aPrecision, bPrecision)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.left)
    const aBase = toPrecision(this.base, calcPrecision, aPrecision)
    const bBase = toPrecision(arg.base, calcPrecision, bPrecision)
    const result = new FixedPoint(aBase + bBase, calcPrecision)
    result.setPrecision(targetPrecision)
    return result
  }

  plus = this.add

  sub(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = max(aPrecision, bPrecision)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.left)
    const aBase = toPrecision(this.base, calcPrecision, aPrecision)
    const bBase = toPrecision(arg.base, calcPrecision, bPrecision)
    const result = new FixedPoint(aBase - bBase, calcPrecision)
    result.setPrecision(targetPrecision)
    return result
  }

  minus = this.sub

  mul(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = aPrecision + bPrecision
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.max)
    const aBase = this.base
    const bBase = arg.base
    const result = new FixedPoint(aBase * bBase, calcPrecision)
    result.setPrecision(targetPrecision)
    return result
  }

  times = this.mul
  multipliedBy = this.mul

  div(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = aPrecision + bPrecision
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.max)
    const aBase = this.base
    const bBase = arg.base
    const newBase = toPrecision(aBase, calcPrecision, aPrecision) / bBase
    const result = new FixedPoint(toPrecision(newBase, calcPrecision, aPrecision), calcPrecision)
    result.setPrecision(targetPrecision)
    return result
  }

  dividedBy = this.div

  cmp(arg: FixedPoint, comparator: (a: bigint, b: bigint) => boolean): boolean {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const newPrecision = max(aPrecision, bPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(arg.base, newPrecision, bPrecision)
    return comparator(aBase, bBase)
  }

  eq(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a === b)
  }

  isEqualTo = this.eq

  gt(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a > b)
  }

  isGreaterThan = this.gt

  lt(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a < b)
  }

  isLessThan = this.lt

  gte(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a >= b)
  }

  isGreaterThanOrEqualTo = this.gte

  lte(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a <= b)
  }

  isLessThanOrEqualTo = this.lte

  neg(): FixedPoint {
    return new FixedPoint(-this.base, this.precision)
  }

  negated = this.neg

  abs(): FixedPoint {
    return new FixedPoint(abs(this.base), this.precision)
  }

  absoluteValue = this.abs

  isZero(): boolean {
    return this.base === 0n
  }

  isPositive(): boolean {
    return this.base > 0n
  }

  isNegative(): boolean {
    return this.base < 0n
  }

  floor() {
    return this.round(Rounding.ROUND_FLOOR)
  }

  ceil() {
    return this.round(Rounding.ROUND_CEIL)
  }

  round(mode: Rounding = Rounding.ROUND_HALF_UP): FixedPoint {
    // No rounding needed for zero precision
    if (this.precision === 0n) {
      return new FixedPoint(this.base, this.precision)
    }

    const isNegative = this.isNegative()
    const absBase = abs(this.base)

    const divisor = 10n ** this.precision

    const integerPart = absBase / divisor
    const fractionalPart = absBase % divisor

    const isHalfwayCase = fractionalPart * 2n === divisor

    let rounded = integerPart

    switch (mode) {
      case Rounding.ROUND_UP: // Away from zero
        // Round up if there's any fractional part
        if (fractionalPart > 0n) {
          rounded = integerPart + 1n
        }
        break

      case Rounding.ROUND_DOWN: // Towards zero
        // Keep the integer part (truncate)
        rounded = integerPart
        break

      case Rounding.ROUND_CEIL: // Towards Infinity
        if (fractionalPart > 0n) {
          if (!isNegative) {
            rounded = integerPart + 1n
          } else {
            rounded = integerPart
          }
        }
        break

      case Rounding.ROUND_FLOOR: // Towards -Infinity
        if (fractionalPart > 0n) {
          if (!isNegative) {
            rounded = integerPart
          } else {
            rounded = integerPart + 1n
          }
        }
        break

      case Rounding.ROUND_HALF_UP: // If halfway, away from zero
        if (fractionalPart > divisor / 2n || (isHalfwayCase)) {
          rounded = integerPart + 1n
        }
        break

      case Rounding.ROUND_HALF_DOWN: // If halfway, towards zero
        if (fractionalPart > divisor / 2n) {
          rounded = integerPart + 1n
        }
        break

      case Rounding.ROUND_HALF_EVEN: // If halfway, towards even neighbor
        if (fractionalPart > divisor / 2n) {
          rounded = integerPart + 1n
        } else if (isHalfwayCase) {
          // If integerPart is even, keep it; if odd, round up
          if (integerPart % 2n === 1n) {
            rounded = integerPart + 1n
          }
        }
        break

      case Rounding.ROUND_HALF_CEIL: // If halfway, towards Infinity
        if (fractionalPart > divisor / 2n) {
          rounded = integerPart + 1n
        } else if (isHalfwayCase) {
          if (!isNegative) {
            rounded = integerPart + 1n
          }
        }
        break

      case Rounding.ROUND_HALF_FLOOR: // If halfway, towards -Infinity
        if (fractionalPart > divisor / 2n) {
          rounded = integerPart + 1n
        } else if (isHalfwayCase) {
          if (isNegative) {
            rounded = integerPart + 1n
          }
        }
        break
    }

    // Apply sign and create new FixedPoint instance with the same precision
    const roundedBase = isNegative ? -rounded * divisor : rounded * divisor
    return new FixedPoint(roundedBase, this.precision)
  }

  setPrecision(newPrecision: bigint, rounding: Rounding = Rounding.ROUND_DOWN): void {
    if (newPrecision < this.precision) {
      const rounded = new FixedPoint(this.base, this.precision - newPrecision).round(rounding)
      this._base = toPrecision(rounded.base, newPrecision, this.precision)
      this._precision = newPrecision
    } else if (newPrecision > this.precision) {
      this._base = toPrecision(this.base, newPrecision, this.precision)
      this._precision = newPrecision
    }
  }

  toPrecision(resultPrecision: number | bigint, rounding: Rounding = Rounding.ROUND_DOWN): FixedPoint {
    const newPrecision = BigInt(resultPrecision)
    if (newPrecision < this.precision) {
      const rounded = new FixedPoint(this.base, this.precision - newPrecision).round(rounding)
      return new FixedPoint(toPrecision(rounded.base, newPrecision, this.precision), newPrecision)
    } else {
      return new FixedPoint(toPrecision(this.base, newPrecision, this.precision), newPrecision)
    }
  }

  toString() {
    return this.base.toString()
  }

  toJSON() {
    return this.toString()
  }

  toDecimalString() {
    const isNegative = this.isNegative()
    let str = abs(this.base).toString().padStart(Number(this.precision) + 1, '0')
    if (isNegative) {
      str = `-${str}`
    }
    if (this.precision === 0n) {
      return str
    }
    return str.slice(0, -Number(this.precision)) + '.' + str.slice(-Number(this.precision))
  }

  toDecimal() {
    return Number(this.toDecimalString())
  }

  valueOf() {
    return this.toDecimal()
  }
}
