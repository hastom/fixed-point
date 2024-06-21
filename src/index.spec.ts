import { FixedPoint } from './index'
import { FPParser, Numeric } from './types'
import { parseNumeric } from './parsers'

const BTC: FPParser = (numeric: FixedPoint | Numeric) => {
  if (numeric instanceof FixedPoint) {
    return numeric
  }
  return new _BTC(...parseNumeric(numeric, 8))
}

class _BTC extends FixedPoint {
  protected parser: FPParser = BTC
}

const Satoshi: FPParser = (numeric: FixedPoint | Numeric) => {
  if (numeric instanceof FixedPoint) {
    return numeric
  }
  return new _Satoshi(...parseNumeric(numeric, 0))
}

class _Satoshi extends FixedPoint {
  protected parser: FPParser = Satoshi
}

describe('fixed-point', () => {

  it('must add different precisions', () => {
    const a = BTC(1)
    const b = Satoshi(1)
    expect(a.add(b).toDecimalString()).toBe('1.00000001')
  })
})
