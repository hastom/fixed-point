export class FixedPoint {

  private base: bigint

  private precision: bigint

  constructor(base: bigint, precision: bigint | number) {
    this.base = base
    this.precision = BigInt(precision)
  }


  static convertToPrecision(base: bigint, toPrecision: bigint, fromPrecision: bigint) {
    if (toPrecision === fromPrecision) {
      return base
    }
    return base * (10n ** toPrecision) / (10n ** fromPrecision)
  }

  static fromDecimal(base: number, precision: bigint | number) {
    return new FixedPoint(BigInt(base.toFixed(Number(precision)).replace('.', '')), precision)
  }

  getPrecision() {
    return this.precision
  }

  getBase() {
    return this.base
  }

  add(arg: FixedPoint) {
    this.base += FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
    return this
  }

  sub(arg: FixedPoint) {
    this.base -= FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
    return this
  }

  mul(arg: FixedPoint) {
    this.base = FixedPoint.convertToPrecision(
      arg.getBase() * this.base,
      this.precision,
      this.precision + arg.getPrecision()
    )
    return this
  }

  div(arg: FixedPoint) {
    this.base = FixedPoint.convertToPrecision(this.base, this.precision + arg.getPrecision(), this.precision) / arg.getBase()
    return this
  }

  eq(arg: FixedPoint) {
    return this.base === FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
  }

  gt(arg: FixedPoint) {
    return this.base > FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
  }

  lt(arg: FixedPoint) {
    return this.base < FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
  }

  gte(arg: FixedPoint) {
    return this.base >= FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
  }

  lte(arg: FixedPoint) {
    return this.base <= FixedPoint.convertToPrecision(arg.getBase(), this.precision, arg.getPrecision())
  }

  toString() {
    return this.base.toString()
  }

  toJSON() {
    return this.toString()
  }

  toDecimalString() {
    const str = this.base.toString().padStart(Number(this.precision) + 1, '0')
    return str.slice(0, -Number(this.precision)) + '.' + str.slice(-Number(this.precision))
  }

  toDecimal() {
    return Number(this.toDecimalString())
  }

  valueOf() {
    return this.toDecimal()
  }

}
