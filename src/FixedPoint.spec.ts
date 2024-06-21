import { FP, parseNumeric } from './parsers'
import { FixedPoint, PrecisionResolution } from './FixedPoint'
import { FPParser, Numeric } from './types'

describe('fixed-point', () => {
  // creation
  it('must create instance', () => {
    const n = new FixedPoint(1_000n, 3n)
    expect(n.base).toBe(1_000n)
    expect(n.precision).toBe(3n)
    expect(n.toDecimalString()).toBe('1.000')
  })
  it('must create instance from decimal = 1', () => {
    const n = FP([1, 5])
    expect(n.base).toBe(1_00000n)
    expect(n.precision).toBe(5n)
  })
  it('must create instance from decimal < 1', () => {
    const n = FP([0.00001, 5])
    expect(n.base).toBe(1n)
    expect(n.precision).toBe(5n)
  })
  it('must create instance from decimal > 1', () => {
    const n = FP([1.123123, 5])
    expect(n.base).toBe(1_12312n)
    expect(n.precision).toBe(5n)
  })

  // add
  it('must add, same precisions', () => {
    const a = FP([1.12, 2])
    const b = FP([200, 2])
    const c = a.add(b)
    expect(c.base).toBe(201_12n)
    expect(c.precision).toBe(2n)
  })
  it('must add, precision a > precision b', () => {
    const a = FP([1.12, 6])
    const b = FP([5.22, 2])
    const c = a.add(b)
    expect(c.base).toBe(6_340000n)
    expect(c.precision).toBe(6n)
  })
  it('must add, precision a < precision b', () => {
    const a = FP([1.12, 2])
    const b = FP([5.22112, 5])
    const c = a.add(b)
    expect(c.base).toBe(6_34n)
    expect(c.precision).toBe(2n)
  })

  // sub
  it('must sub, same precisions, a > b', () => {
    const a = FP([200, 2])
    const b = FP([1.12, 2])
    const c = a.sub(b)
    expect(c.base).toBe(198_88n)
    expect(c.precision).toBe(2n)
  })
  it('must sub, precision a > precision b, a > b', () => {
    const a = FP([5.22, 6])
    const b = FP([1.12, 2])
    const c = a.sub(b)
    expect(c.base).toBe(4_100000n)
    expect(c.precision).toBe(6n)
  })
  it('must sub, precision a < precision b, a > b', () => {
    const a = FP([5.22112, 2])
    const b = FP([5, 5])
    const c = a.sub(b)
    expect(c.base).toBe(22n)
    expect(c.precision).toBe(2n)
  })
  it('must sub, same precisions, a < b', () => {
    const a = FP([1.12, 2])
    const b = FP([200, 2])
    const c = a.sub(b)
    expect(c.base).toBe(-198_88n)
    expect(c.precision).toBe(2n)
  })
  it('must sub, precision a > precision b, a < b', () => {
    const a = FP([1.12, 6])
    const b = FP([5.12, 2])
    const c = a.sub(b)
    expect(c.base).toBe(-4_000000n)
    expect(c.precision).toBe(6n)
  })
  it('must sub, precision a < precision b, a < b', () => {
    const a = FP([5, 2])
    const b = FP([5.1, 5])
    const c = a.sub(b)
    expect(c.base).toBe(-10n)
    expect(c.precision).toBe(2n)
  })

  // mul
  it('must mul, same precisions, a > 1, b > 1', () => {
    const a = FP([2, 2])
    const b = FP([1.12, 2])
    const c = a.mul(b)
    expect(c.base).toBe(2_24n)
    expect(c.precision).toBe(2n)
  })
  it('must mul, precision a > precision b, a > 1, b > 1', () => {
    const a = FP([5.22, 6])
    const b = FP([1.12, 2])
    const c = a.mul(b)
    expect(c.base).toBe(5_846400n)
    expect(c.precision).toBe(6n)
  })
  it('must mul, precision a < precision b, a > 1, b > 1', () => {
    const a = FP([5.22112, 2])
    const b = FP([5, 5])
    const c = a.mul(b)
    expect(c.base).toBe(26_10n)
    expect(c.precision).toBe(2n)
  })
  it('must mul, same precisions, a < 1, b > 1', () => {
    const a = FP([0.5, 2])
    const b = FP([1.12, 2])
    const c = a.mul(b)
    expect(c.base).toBe(56n)
    expect(c.precision).toBe(2n)
  })
  it('must mul, precision a > precision b, a < 1, b > 1', () => {
    const a = FP([0.212, 6])
    const b = FP([1.12, 2])
    const c = a.mul(b)
    expect(c.base).toBe(237440n)
    expect(c.precision).toBe(6n)
  })
  it('must mul, precision a < precision b, a < 1, b > 1', () => {
    const a = FP([0.32, 2])
    const b = FP([5, 5])
    const c = a.mul(b)
    expect(c.base).toBe(1_60n)
    expect(c.precision).toBe(2n)
  })
  it('must mul, same precisions, a < 1, b < 1', () => {
    const a = FP([0.5, 2])
    const b = FP([0.1, 2])
    const c = a.mul(b)
    expect(c.base).toBe(5n)
    expect(c.precision).toBe(2n)
  })
  it('must mul, precision a > precision b, a < 1, b < 1', () => {
    const a = FP([0.212, 6])
    const b = FP([0.32, 2])
    const c = a.mul(b)
    expect(c.base).toBe(67840n)
    expect(c.precision).toBe(6n)
  })
  it('must mul, precision a < precision b, a < 1, b < 1', () => {
    const a = FP([0.32, 2])
    const b = FP([0.05, 5])
    const c = a.mul(b)
    expect(c.base).toBe(1n)
    expect(c.precision).toBe(2n)
  })

  // div
  it('must div, same precisions, a > 1, b > 1', () => {
    const a = FP([2, 2])
    const b = FP([1.12, 2])
    const c = a.div(b)
    expect(c.base).toBe(1_78n)
    expect(c.precision).toBe(2n)
  })
  it('must div, precision a > precision b, a > 1, b > 1', () => {
    const a = FP([5.22, 6])
    const b = FP([1.12, 2])
    const c = a.div(b)
    expect(c.base).toBe(4_660714n)
    expect(c.precision).toBe(6n)
  })
  it('must div, precision a < precision b, a > 1, b > 1', () => {
    const a = FP([5.22112, 2])
    const b = FP([5, 5])
    const c = a.div(b)
    expect(c.base).toBe(1_04n)
    expect(c.precision).toBe(2n)
  })
  it('must div, same precisions, a < 1, b > 1', () => {
    const a = FP([0.5, 2])
    const b = FP([1.12, 2])
    const c = a.div(b)
    expect(c.base).toBe(44n)
    expect(c.precision).toBe(2n)
  })
  it('must div, precision a > precision b, a < 1, b > 1', () => {
    const a = FP([0.212, 6])
    const b = FP([1.12, 2])
    const c = a.div(b)
    expect(c.base).toBe(189285n)
    expect(c.precision).toBe(6n)
  })
  it('must div, precision a < precision b, a < 1, b > 1', () => {
    const a = FP([0.32, 2])
    const b = FP([5, 5])
    const c = a.div(b)
    expect(c.base).toBe(6n)
    expect(c.precision).toBe(2n)
  })
  it('must div, same precisions, a > 1, b < 1', () => {
    const a = FP([1.12, 2])
    const b = FP([0.5, 2])
    const c = a.div(b)
    expect(c.base).toBe(224n)
    expect(c.precision).toBe(2n)
  })
  it('must div, precision a > precision b, a > 1, b < 1', () => {
    const a = FP([1.12, 6])
    const b = FP([0.21, 2])
    const c = a.div(b)
    expect(c.base).toBe(5_333333n)
    expect(c.precision).toBe(6n)
  })
  it('must div, precision a < precision b, a > 1, b < 1', () => {
    const a = FP([5, 2])
    const b = FP([0.32, 5])
    const c = a.div(b)
    expect(c.base).toBe(15_62n)
    expect(c.precision).toBe(2n)
  })
  it('must div, same precisions, a < 1, b < 1', () => {
    const a = FP([0.08, 2])
    const b = FP([0.08, 2])
    const c = a.div(b)
    expect(c.base).toBe(1_00n)
    expect(c.precision).toBe(2n)
  })
  it('must div, precision a > precision b, a < 1, b < 1', () => {
    const a = FP([0.212, 6])
    const b = FP([0.32, 2])
    const c = a.div(b)
    expect(c.base).toBe(662500n)
    expect(c.precision).toBe(6n)
  })
  it('must div, precision a < precision b, a < 1, b < 1', () => {
    const a = FP([0.32, 2])
    const b = FP([0.05, 5])
    const c = a.div(b)
    expect(c.base).toBe(640n)
    expect(c.precision).toBe(2n)
  })

  // eq
  it('must eq, same precisions, a > b', () => {
    const a = FP([0.5, 2])
    const b = FP([0.1, 2])
    expect(a.eq(b)).toBe(false)
  })
  it('must eq, same precisions, a < b', () => {
    const a = FP([0.1, 2])
    const b = FP([0.5, 2])
    expect(a.eq(b)).toBe(false)
  })
  it('must eq, same precisions, a = b', () => {
    const a = FP([0.1, 2])
    const b = FP([0.1, 2])
    expect(a.eq(b)).toBe(true)
  })

  // toString
  it('must output string, a < 0', () => {
    const a = FP([0.1, 2])
    expect(a.toString()).toBe('10')
  })
  it('must output string, a > 0', () => {
    const a = FP([123.1, 5])
    expect(a.toString()).toBe('12310000')
  })

  // toDecimalString
  it('must output decimal string, a < 0', () => {
    const a = FP([0.1, 2])
    expect(a.toDecimalString()).toBe('0.10')
  })
  it('must output decimal string, a > 0', () => {
    const a = FP([123.1, 5])
    expect(a.toDecimalString()).toBe('123.10000')
  })

  // toDecimal
  it('must output decimal string, a < 0', () => {
    const a = FP([0.1, 2])
    expect(a.toDecimal()).toBe(0.1)
  })
  it('must output decimal string, a > 0', () => {
    const a = FP([123.1, 5])
    expect(a.toDecimal()).toBe(123.1)
  })

  it('must work with subclasses', () => {

    const BTC: FPParser = (n: FixedPoint | Numeric) => {
      if (n instanceof FixedPoint) {
        return n
      }
      return new _BTC(...parseNumeric(n, 8))
    }

    class _BTC extends FixedPoint {
      protected parser: FPParser = BTC

      protected precisionResolution: PrecisionResolution = 'max'
    }

    const a = BTC(1) // means 1.00000000, base 100000000, precision = 8
    const b = BTC(0.00000010) // means 0.0000001, base 10, precision = 8
    const c = a.add(b) // result 1.00000010, base 100000010, precision = 8
    const d = a.div([0.025, 12])
    expect(c.base).toBe(100000010n)
    expect(c.precision).toBe(8n)

    expect(d.base).toBe(40000000000000n)
    expect(d.precision).toBe(12n)
    expect(d.toDecimalString()).toBe('40.000000000000')
  })

})
