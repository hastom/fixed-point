import { Decimals, FixedPoint, Rounding } from './FixedPoint'
import { fpFromDecimal, fpFromInt } from './parsers'

describe('fixed-point', () => {
  it('must create instance', () => {
    const n = new FixedPoint(1_000n, 3n)
    expect(n.base).toBe(1_000n)
    expect(n.precision).toBe(3n)
    expect(n.toDecimalString()).toBe('1.000')
  })

  describe('decimal parser', () => {
    it('must create instance from decimal number = 1', () => {
      const n = fpFromDecimal(1, 5)
      expect(n.base).toBe(1_00000n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal number < 1', () => {
      const n = fpFromDecimal(0.00001, 5)
      expect(n.base).toBe(1n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal number > 1', () => {
      const n = fpFromDecimal(1.123123, 5)
      expect(n.base).toBe(1_12312n)
      expect(n.precision).toBe(5n)
    })

    it('must create instance from decimal string = 1', () => {
      const n = fpFromDecimal('1', 5)
      expect(n.base).toBe(1_00000n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal string < 1', () => {
      const n = fpFromDecimal('0.00001', 5)
      expect(n.base).toBe(1n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal string > 1', () => {
      const n = fpFromDecimal('1.12312', 5)
      expect(n.base).toBe(1_12312n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal string < 0', () => {
      const n = fpFromDecimal('-1.12312', 5)
      expect(n.base).toBe(-1_12312n)
      expect(n.precision).toBe(5n)
    })

    it('must create instance from decimal bigint = 1', () => {
      const n = fpFromDecimal(1n, 5)
      expect(n.base).toBe(1_00000n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal bigint > 1', () => {
      const n = fpFromDecimal(123n, 5)
      expect(n.base).toBe(123_00000n)
      expect(n.precision).toBe(5n)
    })
    it('must create instance from decimal bigint < 0', () => {
      const n = fpFromDecimal(-12, 5)
      expect(n.base).toBe(-12_00000n)
      expect(n.precision).toBe(5n)
    })
  })

  describe('int parser', () => {
    describe('number src', () => {
      it('must create instance from int number (base = 1, src = 9, dst = 5)', () => {
        const n = fpFromInt(1_000_000_000, 9, 5)
        expect(n.base).toBe(1_00000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('1.00000')
      })
      it('must create instance from int number (base = 0.33, src = 9, dst = 5)', () => {
        const n = fpFromInt(330_000_000, 9, 5)
        expect(n.base).toBe(33000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('0.33000')
      })
      it('must create instance from int number (base = 2.55, src = 9, dst = 5)', () => {
        const n = fpFromInt(2_550_000_000, 9, 5)
        expect(n.base).toBe(255000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('2.55000')
      })

      it('must create instance from int number (base = 1, src = 5, dst = 9)', () => {
        const n = fpFromInt(1_00000, 5, 9)
        expect(n.base).toBe(1_000_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('1.000000000')
      })
      it('must create instance from int number (base = 0.33, src = 5, dst = 9)', () => {
        const n = fpFromInt(33000, 5, 9)
        expect(n.base).toBe(330_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('0.330000000')
      })
      it('must create instance from int number (base = 2.55, src = 5, dst = 9)', () => {
        const n = fpFromInt(2_55000, 5, 9)
        expect(n.base).toBe(2_550_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('2.550000000')
      })
    })
    describe('string src', () => {
      it('must create instance from int string (base = 1, src = 9, dst = 5)', () => {
        const n = fpFromInt('1000000000', 9, 5)
        expect(n.base).toBe(1_00000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('1.00000')
      })
      it('must create instance from int string (base = 0.33, src = 9, dst = 5)', () => {
        const n = fpFromInt('330000000', 9, 5)
        expect(n.base).toBe(33000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('0.33000')
      })
      it('must create instance from int string (base = 2.55, src = 9, dst = 5)', () => {
        const n = fpFromInt('2550000000', 9, 5)
        expect(n.base).toBe(255000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('2.55000')
      })

      it('must create instance from int string (base = 1, src = 5, dst = 9)', () => {
        const n = fpFromInt('100000', 5, 9)
        expect(n.base).toBe(1_000_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('1.000000000')
      })
      it('must create instance from int string (base = 0.33, src = 5, dst = 9)', () => {
        const n = fpFromInt('33000', 5, 9)
        expect(n.base).toBe(330_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('0.330000000')
      })
      it('must create instance from int string (base = 2.55, src = 5, dst = 9)', () => {
        const n = fpFromInt('255000', 5, 9)
        expect(n.base).toBe(2_550_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('2.550000000')
      })
    })

    describe('bigint src', () => {
      it('must create instance from int bigint (base = 1, src = 9, dst = 5)', () => {
        const n = fpFromInt(1_000_000_000n, 9, 5)
        expect(n.base).toBe(1_00000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('1.00000')
      })
      it('must create instance from int bigint (base = 0.33, src = 9, dst = 5)', () => {
        const n = fpFromInt(330_000_000n, 9, 5)
        expect(n.base).toBe(33000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('0.33000')
      })
      it('must create instance from int bigint (base = 2.55, src = 9, dst = 5)', () => {
        const n = fpFromInt(2_550_000_000n, 9, 5)
        expect(n.base).toBe(255000n)
        expect(n.precision).toBe(5n)
        expect(n.toDecimalString()).toBe('2.55000')
      })

      it('must create instance from int bigint (base = 1, src = 5, dst = 9)', () => {
        const n = fpFromInt(1_00000n, 5, 9)
        expect(n.base).toBe(1_000_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('1.000000000')
      })
      it('must create instance from int bigint (base = 0.33, src = 5, dst = 9)', () => {
        const n = fpFromInt(33000n, 5, 9)
        expect(n.base).toBe(330_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('0.330000000')
      })
      it('must create instance from int bigint (base = 2.55, src = 5, dst = 9)', () => {
        const n = fpFromInt(2_55000n, 5, 9)
        expect(n.base).toBe(2_550_000_000n)
        expect(n.precision).toBe(9n)
        expect(n.toDecimalString()).toBe('2.550000000')
      })
    })
  })

  describe('compare', () => {
    describe('=', () => {
      it('must compare = (p1 < p2), positive', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        expect(a.eq(b)).toBe(true)
      })
      it('must compare = (p1 < p2), negative', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.eq(b)).toBe(false)
      })

      it('must compare = (p1 = p2), positive', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 9)
        expect(a.eq(b)).toBe(true)
      })
      it('must compare = (p1 = p2), negative', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.eq(b)).toBe(false)
      })

      it('must compare = (p1 > p2), positive', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 6)
        expect(a.eq(b)).toBe(true)
      })
      it('must compare = (p1 > p2), negative', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('-1', 6)
        expect(a.eq(b)).toBe(false)
      })
    })

    describe('>', () => {
      it('must compare > (p1 < p2), positive', () => {
        const a = fpFromDecimal('1.2203', 6)
        const b = fpFromDecimal('1.2202', 9)
        expect(a.gt(b)).toBe(true)
      })
      it('must compare > (p1 < p2), negative', () => {
        const a = fpFromDecimal('1.220001', 6)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.gt(b)).toBe(false)
      })

      it('must compare > (p1 = p2), positive', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('-1.22', 9)
        expect(a.gt(b)).toBe(true)
      })
      it('must compare > (p1 = p2), negative', () => {
        const a = fpFromDecimal('1.220001', 9)
        const b = fpFromDecimal('1.220002', 9)
        expect(a.gt(b)).toBe(false)
      })

      it('must compare > (p1 > p2), positive', () => {
        const a = fpFromDecimal('2.22', 9)
        const b = fpFromDecimal('1.22', 6)
        expect(a.gt(b)).toBe(true)
      })
      it('must compare > (p1 > p2), negative', () => {
        const a = fpFromDecimal('0.66', 9)
        const b = fpFromDecimal('0.77', 6)
        expect(a.gt(b)).toBe(false)
      })
    })

    describe('<', () => {
      it('must compare < (p1 < p2), positive', () => {
        const a = fpFromDecimal('0.22', 6)
        const b = fpFromDecimal('1.22', 9)
        expect(a.lt(b)).toBe(true)
      })
      it('must compare < (p1 < p2), negative', () => {
        const a = fpFromDecimal('1.221233', 6)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.lt(b)).toBe(false)
      })

      it('must compare < (p1 = p2), positive', () => {
        const a = fpFromDecimal('1.2', 9)
        const b = fpFromDecimal('1.22', 9)
        expect(a.lt(b)).toBe(true)
      })
      it('must compare < (p1 = p2), negative', () => {
        const a = fpFromDecimal('100.22', 9)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.lt(b)).toBe(false)
      })

      it('must compare < (p1 > p2), positive', () => {
        const a = fpFromDecimal('1.20', 9)
        const b = fpFromDecimal('1.22', 6)
        expect(a.lt(b)).toBe(true)
      })
      it('must compare < (p1 > p2), negative', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('-1', 6)
        expect(a.lt(b)).toBe(false)
      })
    })

    describe('>=', () => {
      it('must compare >= (p1 < p2), positive', () => {
        const a = fpFromDecimal('1.2202', 6)
        const b = fpFromDecimal('1.2202', 9)
        expect(a.gte(b)).toBe(true)
      })
      it('must compare >= (p1 < p2), negative', () => {
        const a = fpFromDecimal('1.0', 6)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.gte(b)).toBe(false)
      })

      it('must compare >= (p1 = p2), positive', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('-1.22', 9)
        expect(a.gte(b)).toBe(true)
      })
      it('must compare >= (p1 = p2), negative', () => {
        const a = fpFromDecimal('1.220001', 9)
        const b = fpFromDecimal('1.220002', 9)
        expect(a.gte(b)).toBe(false)
      })

      it('must compare >= (p1 > p2), positive', () => {
        const a = fpFromDecimal('2.22', 9)
        const b = fpFromDecimal('1.22', 6)
        expect(a.gte(b)).toBe(true)
      })
      it('must compare >= (p1 > p2), negative', () => {
        const a = fpFromDecimal('0.66', 9)
        const b = fpFromDecimal('0.77', 6)
        expect(a.gte(b)).toBe(false)
      })
    })

    describe('<=', () => {
      it('must compare <= (p1 < p2), positive', () => {
        const a = fpFromDecimal('0.22', 6)
        const b = fpFromDecimal('1.22', 9)
        expect(a.lte(b)).toBe(true)
      })
      it('must compare <= (p1 < p2), negative', () => {
        const a = fpFromDecimal('1.221233', 6)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.lte(b)).toBe(false)
      })

      it('must compare <= (p1 = p2), positive', () => {
        const a = fpFromDecimal('1.2', 9)
        const b = fpFromDecimal('1.22', 9)
        expect(a.lte(b)).toBe(true)
      })
      it('must compare <= (p1 = p2), negative', () => {
        const a = fpFromDecimal('100.22', 9)
        const b = fpFromDecimal('1.220001', 9)
        expect(a.lte(b)).toBe(false)
      })

      it('must compare <= (p1 > p2), positive', () => {
        const a = fpFromDecimal('1.20', 9)
        const b = fpFromDecimal('1.22', 6)
        expect(a.lte(b)).toBe(true)
      })
      it('must compare <= (p1 > p2), negative', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('-1', 6)
        expect(a.lte(b)).toBe(false)
      })
    })

    describe('= 0', () => {
      it('must compare = 0, positive', () => {
        const a = fpFromDecimal('0.00', 6)
        expect(a.isZero()).toBe(true)
      })
      it('must compare = 0, negative', () => {
        const a = fpFromDecimal('0.000001', 6)
        expect(a.isZero()).toBe(false)
      })
    })

    describe('> 0', () => {
      it('must compare > 0, positive', () => {
        const a = fpFromDecimal('0.00001', 6)
        expect(a.isPositive()).toBe(true)
      })
      it('must compare > 0, negative', () => {
        const a = fpFromDecimal('0', 6)
        expect(a.isPositive()).toBe(false)
      })
    })

    describe('< 0', () => {
      it('must compare < 0, positive', () => {
        const a = fpFromDecimal('-0.00001', 6)
        expect(a.isNegative()).toBe(true)
      })
      it('must compare < 0, negative', () => {
        const a = fpFromDecimal('1', 6)
        expect(a.isNegative()).toBe(false)
      })
    })

  })

  describe('round', () => {
    // ROUND_UP tests
    it('must round up positive numbers', () => {
      const a = fpFromDecimal('2.4', 2)
      const result = a.round(Rounding.ROUND_UP)
      expect(result.toDecimalString()).toBe('3.00')

      const b = fpFromDecimal('2.5', 2)
      const resultB = b.round(Rounding.ROUND_UP)
      expect(resultB.toDecimalString()).toBe('3.00')

      const c = fpFromDecimal('2.1', 2)
      const resultC = c.round(Rounding.ROUND_UP)
      expect(resultC.toDecimalString()).toBe('3.00')
    })

    it('must round up negative numbers', () => {
      const a = fpFromDecimal('-2.4', 2)
      const result = a.round(Rounding.ROUND_UP)
      expect(result.toDecimalString()).toBe('-3.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_UP)
      expect(resultB.toDecimalString()).toBe('-3.00')

      const c = fpFromDecimal('-2.1', 2)
      const resultC = c.round(Rounding.ROUND_UP)
      expect(resultC.toDecimalString()).toBe('-3.00')
    })

    // ROUND_DOWN tests
    it('must round down positive numbers', () => {
      const a = fpFromDecimal('2.4', 2)
      const result = a.round(Rounding.ROUND_DOWN)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.5', 2)
      const resultB = b.round(Rounding.ROUND_DOWN)
      expect(resultB.toDecimalString()).toBe('2.00')

      const c = fpFromDecimal('2.9', 2)
      const resultC = c.round(Rounding.ROUND_DOWN)
      expect(resultC.toDecimalString()).toBe('2.00')
    })

    it('must round down negative numbers', () => {
      const a = fpFromDecimal('-2.4', 2)
      const result = a.round(Rounding.ROUND_DOWN)
      expect(result.toDecimalString()).toBe('-2.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_DOWN)
      expect(resultB.toDecimalString()).toBe('-2.00')

      const c = fpFromDecimal('-2.9', 2)
      const resultC = c.round(Rounding.ROUND_DOWN)
      expect(resultC.toDecimalString()).toBe('-2.00')
    })

    // ROUND_CEIL tests
    it('must round ceiling positive numbers', () => {
      const a = fpFromDecimal('2.4', 2)
      const result = a.round(Rounding.ROUND_CEIL)
      expect(result.toDecimalString()).toBe('3.00')

      const b = fpFromDecimal('2.5', 2)
      const resultB = b.round(Rounding.ROUND_CEIL)
      expect(resultB.toDecimalString()).toBe('3.00')

      const c = fpFromDecimal('2.0', 2)
      const resultC = c.round(Rounding.ROUND_CEIL)
      expect(resultC.toDecimalString()).toBe('2.00')
    })

    it('must round ceiling negative numbers', () => {
      const a = fpFromDecimal('-2.4', 2)
      const result = a.round(Rounding.ROUND_CEIL)
      expect(result.toDecimalString()).toBe('-2.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_CEIL)
      expect(resultB.toDecimalString()).toBe('-2.00')

      const c = fpFromDecimal('-3.0', 2)
      const resultC = c.round(Rounding.ROUND_CEIL)
      expect(resultC.toDecimalString()).toBe('-3.00')
    })

    // ROUND_FLOOR tests
    it('must round floor positive numbers', () => {
      const a = fpFromDecimal('2.4', 2)
      const result = a.round(Rounding.ROUND_FLOOR)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.5', 2)
      const resultB = b.round(Rounding.ROUND_FLOOR)
      expect(resultB.toDecimalString()).toBe('2.00')

      const c = fpFromDecimal('3.0', 2)
      const resultC = c.round(Rounding.ROUND_FLOOR)
      expect(resultC.toDecimalString()).toBe('3.00')
    })

    it('must round floor negative numbers', () => {
      const a = fpFromDecimal('-2.4', 2)
      const result = a.round(Rounding.ROUND_FLOOR)
      expect(result.toDecimalString()).toBe('-3.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_FLOOR)
      expect(resultB.toDecimalString()).toBe('-3.00')

      const c = fpFromDecimal('-2.0', 2)
      const resultC = c.round(Rounding.ROUND_FLOOR)
      expect(resultC.toDecimalString()).toBe('-2.00')
    })

    // ROUND_HALF_UP tests
    it('must round half up with exact .5 cases', () => {
      const a = fpFromDecimal('2.5', 2)
      const result = a.round(Rounding.ROUND_HALF_UP)
      expect(result.toDecimalString()).toBe('3.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_HALF_UP)
      expect(resultB.toDecimalString()).toBe('-3.00')
    })

    it('must round half up with close to .5 cases', () => {
      const a = fpFromDecimal('2.49', 2)
      const result = a.round(Rounding.ROUND_HALF_UP)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.51', 2)
      const resultB = b.round(Rounding.ROUND_HALF_UP)
      expect(resultB.toDecimalString()).toBe('3.00')

      const c = fpFromDecimal('-2.49', 2)
      const resultC = c.round(Rounding.ROUND_HALF_UP)
      expect(resultC.toDecimalString()).toBe('-2.00')

      const d = fpFromDecimal('-2.51', 2)
      const resultD = d.round(Rounding.ROUND_HALF_UP)
      expect(resultD.toDecimalString()).toBe('-3.00')
    })

    // ROUND_HALF_DOWN tests
    it('must round half down with exact .5 cases', () => {
      const a = fpFromDecimal('2.5', 2)
      const result = a.round(Rounding.ROUND_HALF_DOWN)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_HALF_DOWN)
      expect(resultB.toDecimalString()).toBe('-2.00')
    })

    it('must round half down with close to .5 cases', () => {
      const a = fpFromDecimal('2.49', 2)
      const result = a.round(Rounding.ROUND_HALF_DOWN)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.51', 2)
      const resultB = b.round(Rounding.ROUND_HALF_DOWN)
      expect(resultB.toDecimalString()).toBe('3.00')

      const c = fpFromDecimal('-2.49', 2)
      const resultC = c.round(Rounding.ROUND_HALF_DOWN)
      expect(resultC.toDecimalString()).toBe('-2.00')

      const d = fpFromDecimal('-2.51', 2)
      const resultD = d.round(Rounding.ROUND_HALF_DOWN)
      expect(resultD.toDecimalString()).toBe('-3.00')
    })

    // ROUND_HALF_EVEN tests
    it('must round half even with even neighbors', () => {
      const a = fpFromDecimal('2.5', 2)
      const result = a.round(Rounding.ROUND_HALF_EVEN)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_HALF_EVEN)
      expect(resultB.toDecimalString()).toBe('-2.00')
    })

    it('must round half even with odd neighbors', () => {
      const a = fpFromDecimal('3.5', 2)
      const result = a.round(Rounding.ROUND_HALF_EVEN)
      expect(result.toDecimalString()).toBe('4.00')

      const b = fpFromDecimal('-3.5', 2)
      const resultB = b.round(Rounding.ROUND_HALF_EVEN)
      expect(resultB.toDecimalString()).toBe('-4.00')
    })

    it('must round half even with close to .5 cases', () => {
      const a = fpFromDecimal('2.49', 2)
      const result = a.round(Rounding.ROUND_HALF_EVEN)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.51', 2)
      const resultB = b.round(Rounding.ROUND_HALF_EVEN)
      expect(resultB.toDecimalString()).toBe('3.00')
    })

    // ROUND_HALF_CEIL tests
    it('must round half ceil with exact .5 cases', () => {
      const a = fpFromDecimal('2.5', 2)
      const result = a.round(Rounding.ROUND_HALF_CEIL)
      expect(result.toDecimalString()).toBe('3.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_HALF_CEIL)
      expect(resultB.toDecimalString()).toBe('-2.00')
    })

    it('must round half ceil with close to .5 cases', () => {
      const a = fpFromDecimal('2.49', 2)
      const result = a.round(Rounding.ROUND_HALF_CEIL)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.51', 2)
      const resultB = b.round(Rounding.ROUND_HALF_CEIL)
      expect(resultB.toDecimalString()).toBe('3.00')

      const c = fpFromDecimal('-2.49', 2)
      const resultC = c.round(Rounding.ROUND_HALF_CEIL)
      expect(resultC.toDecimalString()).toBe('-2.00')

      const d = fpFromDecimal('-2.51', 2)
      const resultD = d.round(Rounding.ROUND_HALF_CEIL)
      expect(resultD.toDecimalString()).toBe('-3.00')
    })

    // ROUND_HALF_FLOOR tests
    it('must round half floor with exact .5 cases', () => {
      const a = fpFromDecimal('2.5', 2)
      const result = a.round(Rounding.ROUND_HALF_FLOOR)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('-2.5', 2)
      const resultB = b.round(Rounding.ROUND_HALF_FLOOR)
      expect(resultB.toDecimalString()).toBe('-3.00')
    })

    it('must round half floor with close to .5 cases', () => {
      const a = fpFromDecimal('2.49', 2)
      const result = a.round(Rounding.ROUND_HALF_FLOOR)
      expect(result.toDecimalString()).toBe('2.00')

      const b = fpFromDecimal('2.51', 2)
      const resultB = b.round(Rounding.ROUND_HALF_FLOOR)
      expect(resultB.toDecimalString()).toBe('3.00')

      const c = fpFromDecimal('-2.49', 2)
      const resultC = c.round(Rounding.ROUND_HALF_FLOOR)
      expect(resultC.toDecimalString()).toBe('-2.00')

      const d = fpFromDecimal('-2.51', 2)
      const resultD = d.round(Rounding.ROUND_HALF_FLOOR)
      expect(resultD.toDecimalString()).toBe('-3.00')
    })

    // Edge cases
    it('must handle zero correctly across all rounding modes', () => {
      const zero = fpFromDecimal('0.0', 2)

      expect(zero.round(Rounding.ROUND_UP).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_DOWN).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_CEIL).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_FLOOR).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_HALF_UP).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_HALF_DOWN).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_HALF_EVEN).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_HALF_EVEN).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_HALF_CEIL).toDecimalString()).toBe('0.00')
      expect(zero.round(Rounding.ROUND_HALF_FLOOR).toDecimalString()).toBe('0.00')
    })

    // Higher precision numbers test
    it('must handle higher precision numbers correctly', () => {
      const highPrecision = fpFromDecimal('3.141592', 6)

      // Round to integer
      expect(highPrecision.round(Rounding.ROUND_UP).toDecimalString()).toBe('4.000000')
      expect(highPrecision.round(Rounding.ROUND_DOWN).toDecimalString()).toBe('3.000000')
      expect(highPrecision.round(Rounding.ROUND_CEIL).toDecimalString()).toBe('4.000000')
      expect(highPrecision.round(Rounding.ROUND_FLOOR).toDecimalString()).toBe('3.000000')
      expect(highPrecision.round(Rounding.ROUND_HALF_UP).toDecimalString()).toBe('3.000000')
      expect(highPrecision.round(Rounding.ROUND_HALF_DOWN).toDecimalString()).toBe('3.000000')
      expect(highPrecision.round(Rounding.ROUND_HALF_EVEN).toDecimalString()).toBe('3.000000')
      expect(highPrecision.round(Rounding.ROUND_HALF_CEIL).toDecimalString()).toBe('3.000000')
      expect(highPrecision.round(Rounding.ROUND_HALF_FLOOR).toDecimalString()).toBe('3.000000')

      // Test a value with exact .5 in higher precision
      const halfPrecision = fpFromDecimal('3.500000', 6)
      expect(halfPrecision.round(Rounding.ROUND_HALF_UP).toDecimalString()).toBe('4.000000')
      expect(halfPrecision.round(Rounding.ROUND_HALF_DOWN).toDecimalString()).toBe('3.000000')
      expect(halfPrecision.round(Rounding.ROUND_HALF_EVEN).toDecimalString()).toBe('4.000000')
      expect(halfPrecision.round(Rounding.ROUND_HALF_CEIL).toDecimalString()).toBe('4.000000')
      expect(halfPrecision.round(Rounding.ROUND_HALF_FLOOR).toDecimalString()).toBe('3.000000')
    })
    const a = fpFromDecimal('1.22', 9)
    const b = fpFromDecimal('1.22', 9)
    const c = a.add(b)
    expect(c.precision).toBe(9n)
    expect(c.base).toBe(2_440_000_000n)
    expect(c.toDecimalString()).toBe('2.440000000')
  })

  describe('convert precision', () => {
    it('must set precision higher', () => {
      const a = fpFromDecimal('1.22', 2)
      const b = a.toPrecision(9)
      expect(b.toDecimalString()).toBe('1.220000000')
    })
    it('must set precision lower rounding down', () => {
      const a = fpFromDecimal('1.23456789', 8)
      const b = a.toPrecision(2)
      expect(b.toDecimalString()).toBe('1.23')
    })
    it('must set precision lower rounding up > 1', () => {
      const a = fpFromDecimal('1.23456789', 8)
      const b = a.toPrecision(2, Rounding.ROUND_UP)
      expect(b.toDecimalString()).toBe('1.24')
    })
    it('must set precision lower rounding down < 1', () => {
      const a = fpFromDecimal('0.23456789', 8)
      const b = a.toPrecision(0)
      expect(b.toDecimalString()).toBe('0')
    })
    it('must set precision lower rounding up < 1', () => {
      const a = fpFromDecimal('0.23456789', 8)
      const b = a.toPrecision(0, Rounding.ROUND_UP)
      expect(b.toDecimalString()).toBe('1')
    })
  })

  describe('math', () => {
    describe('+', () => {
      it('must add (p1 > p2)', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.add(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 < p2)', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(2_440_000n)
        expect(c.toDecimalString()).toBe('2.440000')
      })

      it('must add (p1 = p2) force left', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.left)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 > p2) force left', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.add(b, Decimals.left)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 < p2) force left', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.left)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(2_440_000n)
        expect(c.toDecimalString()).toBe('2.440000')
      })

      it('must add (p1 = p2) force right', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.right)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 > p2) force right', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.add(b, Decimals.right)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(2_440_000n)
        expect(c.toDecimalString()).toBe('2.440000')
      })
      it('must add (p1 < p2) force right', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.right)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })

      it('must add (p1 = p2) force min', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.min)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 > p2) force min', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.add(b, Decimals.min)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(2_440_000n)
        expect(c.toDecimalString()).toBe('2.440000')
      })
      it('must add (p1 < p2) force min', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.min)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(2_440_000n)
        expect(c.toDecimalString()).toBe('2.440000')
      })

      it('must add (p1 = p2) force max', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.max)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 > p2) force max', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.add(b, Decimals.max)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
      it('must add (p1 < p2) force max', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        const c = a.add(b, Decimals.max)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(2_440_000_000n)
        expect(c.toDecimalString()).toBe('2.440000000')
      })
    })

    describe('-', () => {
      it('must sub (p1 = p2)', () => {
        const a = fpFromDecimal('1.22', 9)
        const b = fpFromDecimal('0.22', 9)
        const c = a.sub(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(1_000_000_000n)
        expect(c.toDecimalString()).toBe('1.000000000')
      })
      it('must sub (p1 > p2)', () => {
        const a = fpFromDecimal('0.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.sub(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(-1_000_000_000n)
        expect(c.toDecimalString()).toBe('-1.000000000')
      })
      it('must sub (p1 < p2)', () => {
        const a = fpFromDecimal('0.00001', 6)
        const b = fpFromDecimal('0.0000001', 9)
        const c = a.sub(b)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(9n)
        expect(c.toDecimalString()).toBe('0.000009')
      })

      it('must sub (p1 = p2) force left', () => {
        const a = fpFromDecimal('-2', 9)
        const b = fpFromDecimal('-3.5', 9)
        const c = a.sub(b, Decimals.left)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(1500000000n)
        expect(c.toDecimalString()).toBe('1.500000000')
      })
      it('must sub (p1 > p2) force left', () => {
        const a = fpFromDecimal('-4', 9)
        const b = fpFromDecimal('2.333', 6)
        const c = a.sub(b, Decimals.left)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(-6333000000n)
        expect(c.toDecimalString()).toBe('-6.333000000')
      })
      it('must sub (p1 < p2) force left', () => {
        const a = fpFromDecimal('1.22', 6)
        const b = fpFromDecimal('1.22', 9)
        const c = a.sub(b, Decimals.left)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(0n)
        expect(c.toDecimalString()).toBe('0.000000')
      })

      it('must sub (p1 = p2) force right', () => {
        const a = fpFromDecimal('0.000000001', 9)
        const b = fpFromDecimal('0.000000002', 9)
        const c = a.sub(b, Decimals.right)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(-1n)
        expect(c.toDecimalString()).toBe('-0.000000001')
      })
      it('must sub (p1 > p2) force right', () => {
        const a = fpFromDecimal('0.000000001', 9)
        const b = fpFromDecimal('0.000001', 6)
        const c = a.sub(b, Decimals.right)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(0n)
        expect(c.toDecimalString()).toBe('0.000000')
      })
      it('must sub (p1 < p2) force right', () => {
        const a = fpFromDecimal('-3.000002', 6)
        const b = fpFromDecimal('-3.000001', 9)
        const c = a.sub(b, Decimals.right)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(-1000n)
        expect(c.toDecimalString()).toBe('-0.000001000')
      })

      it('must sub (p1 = p2) force min', () => {
        const a = fpFromDecimal('1000', 9)
        const b = fpFromDecimal('0.000000999', 9)
        const c = a.sub(b, Decimals.min)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(999999999001n)
        expect(c.toDecimalString()).toBe('999.999999001')
      })
      it('must sub (p1 > p2) force min', () => {
        const a = fpFromDecimal('5.12', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.sub(b, Decimals.min)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(3900000n)
        expect(c.toDecimalString()).toBe('3.900000')
      })
      it('must sub (p1 < p2) force min', () => {
        const a = fpFromDecimal('1.111111', 6)
        const b = fpFromDecimal('1.222222222', 9)
        const c = a.sub(b, Decimals.min)
        expect(c.precision).toBe(6n)
        expect(c.base).toBe(-111111n)
        expect(c.toDecimalString()).toBe('-0.111111')
      })

      it('must sub (p1 = p2) force max', () => {
        const a = fpFromDecimal('1.111111', 9)
        const b = fpFromDecimal('1.222222222', 9)
        const c = a.sub(b, Decimals.max)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(-111111222n)
        expect(c.toDecimalString()).toBe('-0.111111222')
      })
      it('must sub (p1 > p2) force max', () => {
        const a = fpFromDecimal('122.22', 9)
        const b = fpFromDecimal('1.22', 6)
        const c = a.sub(b, Decimals.max)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(121000000000n)
        expect(c.toDecimalString()).toBe('121.000000000')
      })
      it('must sub (p1 < p2) force max', () => {
        const a = fpFromDecimal('122000', 6)
        const b = fpFromDecimal('333333.333333333', 9)
        const c = a.sub(b, Decimals.max)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(-211333333333333n)
        expect(c.toDecimalString()).toBe('-211333.333333333')
      })
    })

    describe('*', () => {
      it('must mul (1 * 10) add precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('10', 9)
        const c = a.mul(b, Decimals.add)
        expect(c.precision).toBe(18n)
        expect(c.base).toBe(10000000000000000000n)
        expect(c.toDecimalString()).toBe('10.000000000000000000')
      })
      it('must mul (1 * 10) keep precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('10', 9)
        const c = a.mul(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(10000000000n)
        expect(c.toDecimalString()).toBe('10.000000000')
      })
      it('must mul (0.1 * 0.2) add precision', () => {
        const a = fpFromDecimal('0.1', 9)
        const b = fpFromDecimal('0.2', 9)
        const c = a.mul(b, Decimals.add)
        expect(c.precision).toBe(18n)
        expect(c.base).toBe(20000000000000000n)
        expect(c.toDecimalString()).toBe('0.020000000000000000')
      })
      it('must mul (0.1 * 0.2) keep precision', () => {
        const a = fpFromDecimal('0.1', 9)
        const b = fpFromDecimal('0.2', 9)
        const c = a.mul(b, Decimals.left)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(20000000n)
        expect(c.toDecimalString()).toBe('0.020000000')
      })
      it('must mul (1e-9 * 2e-9) add precision', () => {
        const a = fpFromDecimal('0.000000001', 9)
        const b = fpFromDecimal('0.000000002', 9)
        const c = a.mul(b, Decimals.add)
        expect(c.precision).toBe(18n)
        expect(c.base).toBe(2n)
        expect(c.toDecimalString()).toBe('0.000000000000000002')
      })
      it('must mul (0.1 * 0.2) keep precision', () => {
        const a = fpFromDecimal('0.000000001', 9)
        const b = fpFromDecimal('0.000000002', 9)
        const c = a.mul(b, Decimals.left)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(0n)
        expect(c.toDecimalString()).toBe('0.000000000')
      })
      it('must mul (1 * 2 * 3 * 4) add precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('2', 9)
        const c = fpFromDecimal('3', 9)
        const d = fpFromDecimal('4', 9)
        const e = a.mul(b, Decimals.add).mul(c, Decimals.add).mul(d, Decimals.add)
        expect(e.precision).toBe(36n)
        expect(e.base).toBe(24000000000000000000000000000000000000n)
        expect(e.toDecimalString()).toBe('24.000000000000000000000000000000000000')
      })
      it('must mul (1.33e9 * 2.33e9 * 3.33e9 * 4.33e9) max precision', () => {
        const a = fpFromDecimal('1330000000', 9)
        const b = fpFromDecimal('2330000000', 9)
        const c = fpFromDecimal('3330000000', 9)
        const d = fpFromDecimal('4330000000', 9)
        const e = a.mul(b, Decimals.add).mul(c, Decimals.add).mul(d, Decimals.add)
        expect(e.precision).toBe(36n)
        expect(e.base).toBe(44682729210000000000000000000000000000000000000000000000000000000000000000n)
        expect(e.toDecimalString()).toBe('44682729210000000000000000000000000000.000000000000000000000000000000000000')
      })
    })

    describe('/', () => {
      it('must div (1 / 10) keep precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('10', 9)
        const c = a.div(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(100000000n)
        expect(c.toDecimalString()).toBe('0.100000000')
      })

      it('must div (1 / 1e9) keep precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('1000000000', 9)
        const c = a.div(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(1n)
        expect(c.toDecimalString()).toBe('0.000000001')
      })

      it('must div (1 / 1e12) keep precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('1000000000000', 9)
        const c = a.div(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(0n)
        expect(c.toDecimalString()).toBe('0.000000000')
      })

      it('must div (1 / 3) keep precision', () => {
        const a = fpFromDecimal('1', 9)
        const b = fpFromDecimal('3', 9)
        const c = a.div(b)
        expect(c.precision).toBe(9n)
        expect(c.base).toBe(333333333n)
        expect(c.toDecimalString()).toBe('0.333333333')
      })
    })
  })

  describe('sqrt', () => {
    it('must calculate square root of perfect squares', () => {
      // sqrt(25) = 5
      const d = fpFromDecimal('25', 6)
      const resultD = d.sqrt()
      expect(resultD.toDecimalString()).toBe('5.000000')
    })

    it('must calculate square root of non-perfect squares', () => {
      // sqrt(2) ≈ 1.414213
      const a = fpFromDecimal('2', 6)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('1.414213')

      // sqrt(3) ≈ 1.732050
      const b = fpFromDecimal('3', 6)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('1.732050')

      // sqrt(5) ≈ 2.236067
      const c = fpFromDecimal('5', 6)
      const resultC = c.sqrt()
      expect(resultC.toDecimalString()).toBe('2.236067')

      // sqrt(10) ≈ 3.162277
      const d = fpFromDecimal('10', 6)
      const resultD = d.sqrt()
      expect(resultD.toDecimalString()).toBe('3.162277')
    })

    it('must calculate square root of decimal numbers', () => {
      // sqrt(0.25) = 0.5
      const a = fpFromDecimal('0.25', 6)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('0.500000')

      // sqrt(0.5) ≈ 0.707106
      const b = fpFromDecimal('0.5', 6)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('0.707106')

      // sqrt(1.44) = 1.2
      const c = fpFromDecimal('1.44', 6)
      const resultC = c.sqrt()
      expect(resultC.toDecimalString()).toBe('1.200000')

      // sqrt(2.25) = 1.5
      const d = fpFromDecimal('2.25', 6)
      const resultD = d.sqrt()
      expect(resultD.toDecimalString()).toBe('1.500000')
    })

    it('must calculate square root of very small numbers', () => {
      // sqrt(0.000001) = 0.001
      const a = fpFromDecimal('0.000001', 6)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('0.001000')

      // sqrt(0.000004) = 0.002
      const b = fpFromDecimal('0.000004', 6)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('0.002000')

      // sqrt(0.000009) = 0.003
      const c = fpFromDecimal('0.000009', 6)
      const resultC = c.sqrt()
      expect(resultC.toDecimalString()).toBe('0.003000')
    })

    it('must calculate square root of very large numbers', () => {
      // sqrt(100) = 10
      const a = fpFromDecimal('100', 6)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('10.000000')

      // sqrt(10000) = 100
      const b = fpFromDecimal('10000', 6)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('100.000000')

      // sqrt(1000000) = 1000
      const c = fpFromDecimal('1000000', 6)
      const resultC = c.sqrt()
      expect(resultC.toDecimalString()).toBe('1000.000000')
    })

    it('must calculate square root of 1', () => {
      // sqrt(1) = 1
      const a = fpFromDecimal('1', 6)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('1.000000')

      // Test with different precision
      const b = fpFromDecimal('1', 9)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('1.000000000')
    })

    it('must calculate square root of 0', () => {
      // sqrt(0) = 0
      const a = fpFromDecimal('0', 6)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('0.000000')

      // Test with different precision
      const b = fpFromDecimal('0', 9)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('0.000000000')
    })

    it('must throw error for negative numbers', () => {
      const a = fpFromDecimal('-1', 6)
      expect(() => a.sqrt()).toThrow('Cannot calculate square root of negative number')

      const b = fpFromDecimal('-0.5', 6)
      expect(() => b.sqrt()).toThrow('Cannot calculate square root of negative number')

      const c = fpFromDecimal('-100', 6)
      expect(() => c.sqrt()).toThrow('Cannot calculate square root of negative number')
    })

    it('must work with different precisions', () => {
      // Test with precision 2
      const a = fpFromDecimal('2', 2)
      const result = a.sqrt()
      expect(result.toDecimalString()).toBe('1.41')

      // Test with precision 3
      const b = fpFromDecimal('2', 3)
      const resultB = b.sqrt()
      expect(resultB.toDecimalString()).toBe('1.414')

      // Test with precision 9
      const c = fpFromDecimal('2', 9)
      const resultC = c.sqrt()
      expect(resultC.toDecimalString()).toBe('1.414213562')
    })

    it('must have squareRoot alias', () => {
      const a = fpFromDecimal('4', 6)
      const result1 = a.sqrt()
      const result2 = a.squareRoot()
      expect(result1.toDecimalString()).toBe(result2.toDecimalString())
      expect(result1.toDecimalString()).toBe('2.000000')
    })

    it('must preserve precision of original number', () => {
      const a = fpFromDecimal('9', 6)
      const result = a.sqrt()
      expect(result.precision).toBe(6n)

      const b = fpFromDecimal('9', 9)
      const resultB = b.sqrt()
      expect(resultB.precision).toBe(9n)
    })

    it('must handle edge cases with high precision', () => {
      // Test a number that requires multiple Newton-Raphson iterations
      const a = fpFromDecimal('123.456789', 9)
      const result = a.sqrt()
      // sqrt(123.456789) ≈ 11.111111060
      expect(result.toDecimalString()).toBe('11.111111060')
    })
  })
})
