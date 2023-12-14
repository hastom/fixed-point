import {FixedPoint} from "./index";

describe('fixed-point', () => {
  // creation
  it('must create instance', () => {
    const n = new FixedPoint(1_000n, 3)
    expect(n.getBase()).toStrictEqual(1_000n)
    expect(n.getPrecision()).toStrictEqual(3n)
  })
  it('must create instance from decimal = 1', () => {
    const n = FixedPoint.fromDecimal(1, 5)
    expect(n.getBase()).toStrictEqual(1_00000n)
    expect(n.getPrecision()).toStrictEqual(5n)
  })
  it('must create instance from decimal < 1', () => {
    const n = FixedPoint.fromDecimal(0.00001, 5)
    expect(n.getBase()).toStrictEqual(1n)
    expect(n.getPrecision()).toStrictEqual(5n)
  })
  it('must create instance from decimal > 1', () => {
    const n = FixedPoint.fromDecimal(1.123123, 5)
    expect(n.getBase()).toStrictEqual(1_12312n)
    expect(n.getPrecision()).toStrictEqual(5n)
  })

  // add
  it('must add, same precisions', () => {
    const a = FixedPoint.fromDecimal(1.12, 2)
    const b = FixedPoint.fromDecimal(200, 2)
    a.add(b)
    expect(a.getBase()).toStrictEqual(201_12n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must add, precision a > precision b', () => {
    const a = FixedPoint.fromDecimal(1.12, 6)
    const b = FixedPoint.fromDecimal(5.22, 2)
    a.add(b)
    expect(a.getBase()).toStrictEqual(6_340000n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must add, precision a < precision b', () => {
    const a = FixedPoint.fromDecimal(1.12, 2)
    const b = FixedPoint.fromDecimal(5.22112, 5)
    a.add(b)
    expect(a.getBase()).toStrictEqual(6_34n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })

  // sub
  it('must sub, same precisions, a > b', () => {
    const a = FixedPoint.fromDecimal(200, 2)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.sub(b)
    expect(a.getBase()).toStrictEqual(198_88n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must sub, precision a > precision b, a > b', () => {
    const a = FixedPoint.fromDecimal(5.22, 6)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.sub(b)
    expect(a.getBase()).toStrictEqual(4_100000n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must sub, precision a < precision b, a > b', () => {
    const a = FixedPoint.fromDecimal(5.22112, 2)
    const b = FixedPoint.fromDecimal(5, 5)
    a.sub(b)
    expect(a.getBase()).toStrictEqual(22n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must sub, same precisions, a < b', () => {
    const a = FixedPoint.fromDecimal(1.12, 2)
    const b = FixedPoint.fromDecimal(200, 2)
    a.sub(b)
    expect(a.getBase()).toStrictEqual(-198_88n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must sub, precision a > precision b, a < b', () => {
    const a = FixedPoint.fromDecimal(1.12, 6)
    const b = FixedPoint.fromDecimal(5.12, 2)
    a.sub(b)
    expect(a.getBase()).toStrictEqual(-4_000000n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must sub, precision a < precision b, a < b', () => {
    const a = FixedPoint.fromDecimal(5, 2)
    const b = FixedPoint.fromDecimal(5.1, 5)
    a.sub(b)
    expect(a.getBase()).toStrictEqual(-10n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })

  // mul
  it('must mul, same precisions, a > 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(2, 2)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(2_24n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must mul, precision a > precision b, a > 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(5.22, 6)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(5_846400n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must mul, precision a < precision b, a > 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(5.22112, 2)
    const b = FixedPoint.fromDecimal(5, 5)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(26_10n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must mul, same precisions, a < 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(0.5, 2)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(56n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must mul, precision a > precision b, a < 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(0.212, 6)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(237440n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must mul, precision a < precision b, a < 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(0.32, 2)
    const b = FixedPoint.fromDecimal(5, 5)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(1_60n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must mul, same precisions, a < 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(0.5, 2)
    const b = FixedPoint.fromDecimal(0.1, 2)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(5n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must mul, precision a > precision b, a < 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(0.212, 6)
    const b = FixedPoint.fromDecimal(0.32, 2)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(67840n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must mul, precision a < precision b, a < 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(0.32, 2)
    const b = FixedPoint.fromDecimal(0.05, 5)
    a.mul(b)
    expect(a.getBase()).toStrictEqual(1n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })

  // div
  it('must div, same precisions, a > 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(2, 2)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(1_78n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, precision a > precision b, a > 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(5.22, 6)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(4_660714n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must div, precision a < precision b, a > 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(5.22112, 2)
    const b = FixedPoint.fromDecimal(5, 5)
    a.div(b)
    expect(a.getBase()).toStrictEqual(1_04n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, same precisions, a < 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(0.5, 2)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(44n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, precision a > precision b, a < 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(0.212, 6)
    const b = FixedPoint.fromDecimal(1.12, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(189285n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must div, precision a < precision b, a < 1, b > 1', () => {
    const a = FixedPoint.fromDecimal(0.32, 2)
    const b = FixedPoint.fromDecimal(5, 5)
    a.div(b)
    expect(a.getBase()).toStrictEqual(6n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, same precisions, a > 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(1.12, 2)
    const b = FixedPoint.fromDecimal(0.5, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(224n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, precision a > precision b, a > 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(1.12, 6)
    const b = FixedPoint.fromDecimal(0.21, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(5_333333n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must div, precision a < precision b, a > 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(5, 2)
    const b = FixedPoint.fromDecimal(0.32, 5)
    a.div(b)
    expect(a.getBase()).toStrictEqual(15_62n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, same precisions, a < 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(0.08, 2)
    const b = FixedPoint.fromDecimal(0.08, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(1_00n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })
  it('must div, precision a > precision b, a < 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(0.212, 6)
    const b = FixedPoint.fromDecimal(0.32, 2)
    a.div(b)
    expect(a.getBase()).toStrictEqual(662500n)
    expect(a.getPrecision()).toStrictEqual(6n)
  })
  it('must div, precision a < precision b, a < 1, b < 1', () => {
    const a = FixedPoint.fromDecimal(0.32, 2)
    const b = FixedPoint.fromDecimal(0.05, 5)
    a.div(b)
    expect(a.getBase()).toStrictEqual(640n)
    expect(a.getPrecision()).toStrictEqual(2n)
  })

  //eq
  it('must eq, same precisions, a > b', () => {
    const a = FixedPoint.fromDecimal(0.5, 2)
    const b = FixedPoint.fromDecimal(0.1, 2)
    expect(a.eq(b)).toStrictEqual(false)
  })
  it('must eq, same precisions, a < b', () => {
    const a = FixedPoint.fromDecimal(0.1, 2)
    const b = FixedPoint.fromDecimal(0.5, 2)
    expect(a.eq(b)).toStrictEqual(false)
  })
  it('must eq, same precisions, a = b', () => {
    const a = FixedPoint.fromDecimal(0.1, 2)
    const b = FixedPoint.fromDecimal(0.1, 2)
    expect(a.eq(b)).toStrictEqual(true)
  })

  // toString
  it('must output string, a < 0', () => {
    const a = FixedPoint.fromDecimal(0.1, 2)
    expect(a.toString()).toStrictEqual('100')
  })
  it('must output string, a > 0', () => {
    const a = FixedPoint.fromDecimal(123.1, 5)
    expect(a.toString()).toStrictEqual('12310000')
  })

  // toDecimalString
  it('must output decimal string, a < 0', () => {
    const a = FixedPoint.fromDecimal(0.1, 2)
    expect(a.toDecimalString()).toStrictEqual('0.10')
  })
  it('must output decimal string, a > 0', () => {
    const a = FixedPoint.fromDecimal(123.1, 5)
    expect(a.toDecimalString()).toStrictEqual('123.10000')
  })

  // toDecimal
  it('must output decimal string, a < 0', () => {
    const a = FixedPoint.fromDecimal(0.1, 2)
    expect(a.toDecimal()).toStrictEqual(0.1)
  })
  it('must output decimal string, a > 0', () => {
    const a = FixedPoint.fromDecimal(123.1, 5)
    expect(a.toDecimal()).toStrictEqual(123.1)
  })

})
