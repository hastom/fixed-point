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

describe('fixed-point', () => {

  it('must add', () => {
    const a = BTC(1.24)
    expect(a.add(0.17).toDecimalString()).toBe('1.41000000')
  })

})
