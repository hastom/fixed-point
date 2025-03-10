/* eslint-disable @typescript-eslint/no-explicit-any */
import { abs, max, min, toPrecision } from './math'
import * as util from 'node:util'

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

  readonly #base: bigint

  readonly #precision: bigint

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

  add(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = pickPrecision(aPrecision, bPrecision, Decimals.max)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.left)
    const aBase = toPrecision(this.base, calcPrecision, aPrecision)
    const bBase = toPrecision(arg.base, calcPrecision, bPrecision)
    return new FixedPoint(aBase + bBase, calcPrecision).toPrecision(targetPrecision)
  }

  sub(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = pickPrecision(aPrecision, bPrecision, Decimals.max)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.left)
    const aBase = toPrecision(this.base, calcPrecision, aPrecision)
    const bBase = toPrecision(arg.base, calcPrecision, bPrecision)
    return new FixedPoint(aBase - bBase, calcPrecision).toPrecision(targetPrecision)
  }

  mul(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = pickPrecision(aPrecision, bPrecision, aPrecision + bPrecision)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.max)
    const aBase = this.base
    const bBase = arg.base
    const newBase = toPrecision(aBase * bBase, calcPrecision, aPrecision + bPrecision)
    return new FixedPoint(newBase, calcPrecision).toPrecision(targetPrecision)
  }

  div(arg: FixedPoint, resultPrecision?: PrecisionResolution): FixedPoint {
    const aPrecision = this.precision
    const bPrecision = arg.precision
    const calcPrecision = pickPrecision(aPrecision, bPrecision, aPrecision + bPrecision)
    const targetPrecision = pickPrecision(aPrecision, bPrecision, resultPrecision ?? Decimals.max)
    const aBase = this.base
    const bBase = arg.base
    const newBase = toPrecision(aBase, calcPrecision, aPrecision) / bBase
    return new FixedPoint(toPrecision(newBase, calcPrecision, aPrecision), calcPrecision).toPrecision(targetPrecision)
  }

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

  gt(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a > b)
  }

  lt(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a < b)
  }

  gte(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a >= b)
  }

  lte(arg: FixedPoint): boolean {
    return this.cmp(arg, (a, b) => a <= b)
  }

  neg(): FixedPoint {
    return new FixedPoint(-this.base, this.precision)
  }

  abs(): FixedPoint {
    return new FixedPoint(abs(this.base), this.precision)
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

  toPrecision(resultPrecision: number | bigint): FixedPoint {
    const newPrecision = BigInt(resultPrecision)
    return new FixedPoint(toPrecision(this.base, newPrecision, this.precision), newPrecision)
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

  * [Symbol.iterator]() {
    yield this.base
    yield this.precision
  }

  [util.inspect.custom]() {
    return `FixedPoint { base: ${this.base}, precision: ${this.precision}, decimal: ${this.toDecimalString()} }`
  }
}
