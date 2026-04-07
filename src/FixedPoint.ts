/* eslint-disable @typescript-eslint/no-explicit-any */
import { abs, max2, min2, pow10, toPrecision } from './math'

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
      return min2(aPrecision, bPrecision)
    case Decimals.max:
      return max2(aPrecision, bPrecision)
    case Decimals.add:
      return aPrecision + bPrecision
    case Decimals.sub:
      return max2(aPrecision, bPrecision) - min2(aPrecision, bPrecision)
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

  base: bigint

  precision: bigint

  constructor(base: bigint, precision: bigint) {
    this.base = base
    this.precision = precision
  }

  add(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    if (resultPrecision === undefined && this.precision === arg.precision) {
      return new FixedPoint(this.base + arg.base, this.precision)
    }
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = max2(aPrecision, bPrecision)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.left)
    const aBase = toPrecision(this.base, calcPrecision, aPrecision)
    const bBase = toPrecision(arg.base, calcPrecision, bPrecision)
    return new FixedPoint(toPrecision(aBase + bBase, targetPrecision, calcPrecision), targetPrecision)
  }

  sub(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    if (resultPrecision === undefined && this.precision === arg.precision) {
      return new FixedPoint(this.base - arg.base, this.precision)
    }
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = max2(aPrecision, bPrecision)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.left)
    const aBase = toPrecision(this.base, calcPrecision, aPrecision)
    const bBase = toPrecision(arg.base, calcPrecision, bPrecision)
    return new FixedPoint(toPrecision(aBase - bBase, targetPrecision, calcPrecision), targetPrecision)
  }

  mul(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    if (resultPrecision === undefined && this.precision === arg.precision) {
      return new FixedPoint((this.base * arg.base) / pow10(this.precision), this.precision)
    }
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = aPrecision + bPrecision
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.max)
    const rawBase = this.base * arg.base // at calcPrecision
    return new FixedPoint(toPrecision(rawBase, targetPrecision, calcPrecision), targetPrecision)
  }

  div(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    if (resultPrecision === undefined && this.precision === arg.precision) {
      return new FixedPoint((this.base * pow10(this.precision)) / arg.base, this.precision)
    }
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.max)
    // (aBase * 10^bPrecision) / bBase yields result at precision aPrecision
    const newBase = (this.base * pow10(bPrecision)) / arg.base
    return new FixedPoint(toPrecision(newBase, targetPrecision, aPrecision), targetPrecision)
  }

  cmp(arg: FixedPoint, comparator: (a: bigint, b: bigint) => boolean): boolean {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const newPrecision = max2(aPrecision, bPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(arg.base, newPrecision, bPrecision)
    return comparator(aBase, bBase)
  }

  eq(arg: FixedPoint): boolean {
    if (this.precision === arg.precision) {return this.base === arg.base}
    return this.cmp(arg, (a, b) => a === b)
  }

  gt(arg: FixedPoint): boolean {
    if (this.precision === arg.precision) {return this.base > arg.base}
    return this.cmp(arg, (a, b) => a > b)
  }

  lt(arg: FixedPoint): boolean {
    if (this.precision === arg.precision) {return this.base < arg.base}
    return this.cmp(arg, (a, b) => a < b)
  }

  gte(arg: FixedPoint): boolean {
    if (this.precision === arg.precision) {return this.base >= arg.base}
    return this.cmp(arg, (a, b) => a >= b)
  }

  lte(arg: FixedPoint): boolean {
    if (this.precision === arg.precision) {return this.base <= arg.base}
    return this.cmp(arg, (a, b) => a <= b)
  }

  neg(): FixedPoint {
    return new FixedPoint(-this.base, this.precision)
  }

  abs(): FixedPoint {
    return new FixedPoint(abs(this.base), this.precision)
  }

  sqrt(): FixedPoint {
    if (this.isNegative()) {
      throw new Error('Cannot calculate square root of negative number')
    }

    if (this.isZero()) {
      return new FixedPoint(0n, this.precision)
    }

    // For Newton-Raphson method, we need higher precision for intermediate calculations
    const workingPrecision = this.precision + 10n
    const workingThis = new FixedPoint(toPrecision(this.base, workingPrecision, this.precision), workingPrecision)

    // Initial guess: use the number shifted right by half the precision
    // This gives us a reasonable starting point for the Newton-Raphson method
    let x = new FixedPoint(workingThis.base >> (workingPrecision / 2n), workingPrecision)

    // Handle case where initial guess is zero (for very small numbers)
    if (x.isZero()) {
      x = new FixedPoint(10n ** (workingPrecision / 2n), workingPrecision)
    }

    const two = new FixedPoint(2n * (10n ** workingPrecision), workingPrecision)
    const epsilon = new FixedPoint(1n, workingPrecision) // Minimum precision unit

    // Newton-Raphson iteration: x_{n+1} = (x_n + a/x_n) / 2
    for (let i = 0; i < 50; i++) { // Maximum 50 iterations to prevent infinite loops
      const quotient = workingThis.div(x, workingPrecision)
      const newX = x.add(quotient, workingPrecision).div(two, workingPrecision)

      // Check for convergence
      if (newX.sub(x, workingPrecision).abs().lte(epsilon)) {
        break
      }

      x = newX
    }

    // Convert back to original precision
    return x.toPrecision(this.precision)
  }

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

    const divisor = pow10(this.precision)

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
      if (rounding === Rounding.ROUND_DOWN) {
        // Fast path: ROUND_DOWN is just truncation — BigInt division truncates towards zero
        this.base = this.base / pow10(this.precision - newPrecision)
        this.precision = newPrecision
      } else {
        const rounded = new FixedPoint(this.base, this.precision - newPrecision).round(rounding)
        this.base = toPrecision(rounded.base, newPrecision, this.precision)
        this.precision = newPrecision
      }
    } else if (newPrecision > this.precision) {
      this.base = toPrecision(this.base, newPrecision, this.precision)
      this.precision = newPrecision
    }
  }

  toPrecision(resultPrecision: number | bigint, rounding: Rounding = Rounding.ROUND_DOWN): FixedPoint {
    const newPrecision = BigInt(resultPrecision)
    if (newPrecision < this.precision) {
      if (rounding === Rounding.ROUND_DOWN) {
        return new FixedPoint(this.base / pow10(this.precision - newPrecision), newPrecision)
      }
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

  toDecimalString(trimTrailingZeros = false) {
    const isNegative = this.isNegative()
    let str = abs(this.base).toString().padStart(Number(this.precision) + 1, '0')
    if (isNegative) {
      str = `-${str}`
    }
    if (this.precision === 0n) {
      return str
    }
    const intPart = str.slice(0, -Number(this.precision))
    const fracPart = str.slice(-Number(this.precision))
    if (!trimTrailingZeros) {
      return `${intPart}.${fracPart}`
    }
    let end = fracPart.length
    while (end > 0 && fracPart.charCodeAt(end - 1) === 48) {
      end -= 1
    }
    return end === 0 ? intPart : `${intPart}.${fracPart.slice(0, end)}`
  }

  toDecimal() {
    return Number(this.toDecimalString())
  }

  valueOf() {
    return this.toDecimal()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/consistent-type-definitions,no-redeclare
export interface FixedPoint {
  plus: FixedPoint['add'],
  minus: FixedPoint['sub'],
  times: FixedPoint['mul'],
  multipliedBy: FixedPoint['mul'],
  dividedBy: FixedPoint['div'],
  isEqualTo: FixedPoint['eq'],
  isGreaterThan: FixedPoint['gt'],
  isLessThan: FixedPoint['lt'],
  isGreaterThanOrEqualTo: FixedPoint['gte'],
  isLessThanOrEqualTo: FixedPoint['lte'],
  negated: FixedPoint['neg'],
  absoluteValue: FixedPoint['abs'],
  squareRoot: FixedPoint['sqrt'],
}

const proto = FixedPoint.prototype
proto.plus = proto.add
proto.minus = proto.sub
proto.times = proto.mul
proto.multipliedBy = proto.mul
proto.dividedBy = proto.div
proto.isEqualTo = proto.eq
proto.isGreaterThan = proto.gt
proto.isLessThan = proto.lt
proto.isGreaterThanOrEqualTo = proto.gte
proto.isLessThanOrEqualTo = proto.lte
proto.negated = proto.neg
proto.absoluteValue = proto.abs
proto.squareRoot = proto.sqrt
