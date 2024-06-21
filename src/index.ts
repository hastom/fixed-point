/* eslint-disable @typescript-eslint/no-explicit-any */
import { FPParser, Numeric, Precision } from './types'
import { abs, max, toPrecision } from './math'
import { FP, parsePrecision } from './parsers'

const pickPrecision = (aPrecision: bigint, bPrecision: bigint, resultPrecision?: Precision): bigint => {
  return typeof resultPrecision !== 'undefined'
    ? parsePrecision(resultPrecision)
    : max(aPrecision, bPrecision)
}

export class FixedPoint {

  readonly #base: bigint

  readonly #precision: bigint

  protected readonly parser: FPParser = FP

  constructor(base: bigint, precision: bigint) {
    this.#base = base
    this.#precision = precision
  }

  get base() {
    return this.#base
  }

  get precision() {
    return this.#precision
  }

  add(arg: FixedPoint | Numeric, resultPrecision?: Precision): this {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    console.log(aBase, bBase)
    return new (this.constructor as any)(aBase + bBase, newPrecision)
  }

  sub(arg: FixedPoint | Numeric, resultPrecision?: Precision): this {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    return new (this.constructor as any)(aBase - bBase, newPrecision)
  }

  mul(arg: FixedPoint | Numeric, resultPrecision?: Precision): this {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = this.base
    const bBase = parsedArg.base
    const newBase = toPrecision(aBase * bBase, newPrecision, aPrecision + bPrecision)
    return new (this.constructor as any)(newBase, newPrecision)
  }

  div(arg: FixedPoint | Numeric, resultPrecision?: Precision): this {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = this.base
    const bBase = parsedArg.base
    const newBase = toPrecision(aBase, aPrecision + bPrecision, aPrecision) / bBase
    return new (this.constructor as any)(toPrecision(newBase, newPrecision, aPrecision + bPrecision), newPrecision)
  }

  eq(arg: FixedPoint | Numeric, resultPrecision?: Precision): boolean {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    return aBase === bBase
  }

  gt(arg: FixedPoint | Numeric, resultPrecision?: Precision): boolean {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    return aBase > bBase
  }

  lt(arg: FixedPoint | Numeric, resultPrecision?: Precision): boolean {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    return aBase < bBase
  }

  gte(arg: FixedPoint | Numeric, resultPrecision?: Precision): boolean {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    return aBase >= bBase
  }

  lte(arg: FixedPoint | Numeric, resultPrecision?: Precision): boolean {
    const parsedArg = this.parser(arg)
    const aPrecision = this.precision
    const bPrecision = parsedArg.precision
    const newPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision)
    const aBase = toPrecision(this.base, newPrecision, aPrecision)
    const bBase = toPrecision(parsedArg.base, newPrecision, bPrecision)
    return aBase <= bBase
  }

  neg(): this {
    return new (this.constructor as any)(-this.base, this.precision)
  }

  abs(): this {
    return new (this.constructor as any)(abs(this.base), this.precision)
  }

  toString() {
    return this.base.toString()
  }

  toJSON() {
    return this.toString()
  }

  toDecimalString() {
    const str = this.base.toString().padStart(Number(this.precision) + 1, '0')
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

  * [Symbol.iterator]() {
    yield this.base
    yield this.precision
  }
}
