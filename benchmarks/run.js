/* eslint-disable no-console,@typescript-eslint/no-var-requires */
'use strict'

const Benchmark = require('benchmark')
const { BigNumber } = require('bignumber.js')
const { FixedPoint, fpFromDecimal, Rounding } = require('../dist')

// ─── Helpers ───────────────────────────────────────────────────────────────────

const PRECISION = 18 // common precision (e.g. Ethereum wei)
const SCALE = 10n ** 18n

// Pre-create values used across suites so construction time is not measured
// FixedPoint values
const fpA = fpFromDecimal('12345.678901234567890', PRECISION) // ~mid-size
const fpB = fpFromDecimal('9876.543210987654321', PRECISION)
const fpSmall = fpFromDecimal('0.000000000000000001', PRECISION)
const fpLarge = fpFromDecimal('999999999999999999.999999999999999999', PRECISION)
const fpNeg = fpFromDecimal('-42.123456789012345678', PRECISION)
const fpSqrt = fpFromDecimal('2.000000000000000000', PRECISION)

// BigNumber values (configured to match precision)
BigNumber.config({ DECIMAL_PLACES: PRECISION, ROUNDING_MODE: BigNumber.ROUND_DOWN })
const bnA = new BigNumber('12345.678901234567890000')
const bnB = new BigNumber('9876.543210987654321000')
const bnSmall = new BigNumber('0.000000000000000001')
const bnLarge = new BigNumber('999999999999999999.999999999999999999')
const bnNeg = new BigNumber('-42.123456789012345678')
const bnSqrt = new BigNumber('2.000000000000000000')

// Plain BigInt values (scaled by 10^18 to represent the same decimals)
const biA = 12345678901234567890n // 12345.678901234567890 * 10^18
const biB = 9876543210987654321n // 9876.543210987654321 * 10^18
const biSmall = 1n
const biLarge = 999999999999999999999999999999999999n
const biNeg = -42123456789012345678n

// ─── Suite runner ──────────────────────────────────────────────────────────────

const suites = []

function makeSuite(name, setup) {
  const suite = new Benchmark.Suite(name)
  setup(suite)
  suites.push(suite)
}

// ─── 1. Creation / Parsing ─────────────────────────────────────────────────────

makeSuite('Creation from decimal string', (suite) => {
  suite
    .add('FixedPoint  fpFromDecimal(str)', () => {
      fpFromDecimal('12345.678901234567890', 18)
    })
    .add('BigNumber   new BigNumber(str)', () => {
      new BigNumber('12345.678901234567890000')
    })
    .add('BigInt      BigInt(str)', () => {
      BigInt('12345678901234567890')
    })
})

// ─── 2. Addition ───────────────────────────────────────────────────────────────

makeSuite('Addition', (suite) => {
  suite
    .add('FixedPoint  a.add(b)', () => {
      fpA.add(fpB)
    })
    .add('BigNumber   a.plus(b)', () => {
      bnA.plus(bnB)
    })
    .add('BigInt      a + b', () => {
      biA + biB
    })
})

// ─── 3. Subtraction ────────────────────────────────────────────────────────────

makeSuite('Subtraction', (suite) => {
  suite
    .add('FixedPoint  a.sub(b)', () => {
      fpA.sub(fpB)
    })
    .add('BigNumber   a.minus(b)', () => {
      bnA.minus(bnB)
    })
    .add('BigInt      a - b', () => {
      biA - biB
    })
})

// ─── 4. Multiplication ─────────────────────────────────────────────────────────

makeSuite('Multiplication', (suite) => {
  suite
    .add('FixedPoint  a.mul(b)', () => {
      fpA.mul(fpB)
    })
    .add('BigNumber   a.times(b)', () => {
      bnA.times(bnB)
    })
    .add('BigInt      a * b / SCALE', () => {
      ;(biA * biB) / SCALE
    })
})

// ─── 5. Division ───────────────────────────────────────────────────────────────

makeSuite('Division', (suite) => {
  suite
    .add('FixedPoint  a.div(b)', () => {
      fpA.div(fpB)
    })
    .add('BigNumber   a.div(b)', () => {
      bnA.div(bnB)
    })
    .add('BigInt      (a * SCALE) / b', () => {
      ;(biA * SCALE) / biB
    })
})

// ─── 6. Comparison (eq) ────────────────────────────────────────────────────────

makeSuite('Comparison (eq)', (suite) => {
  suite
    .add('FixedPoint  a.eq(b)', () => {
      fpA.eq(fpB)
    })
    .add('BigNumber   a.eq(b)', () => {
      bnA.eq(bnB)
    })
    .add('BigInt      a === b', () => {
      biA === biB
    })
})

// ─── 7. Comparison (gt) ────────────────────────────────────────────────────────

makeSuite('Comparison (gt)', (suite) => {
  suite
    .add('FixedPoint  a.gt(b)', () => {
      fpA.gt(fpB)
    })
    .add('BigNumber   a.gt(b)', () => {
      bnA.gt(bnB)
    })
    .add('BigInt      a > b', () => {
      biA > biB
    })
})

// ─── 8. Comparison (lt) ────────────────────────────────────────────────────────

makeSuite('Comparison (lt)', (suite) => {
  suite
    .add('FixedPoint  a.lt(b)', () => {
      fpA.lt(fpB)
    })
    .add('BigNumber   a.lt(b)', () => {
      bnA.lt(bnB)
    })
    .add('BigInt      a < b', () => {
      biA < biB
    })
})

// ─── 9. Comparison (gte) ──────────────────────────────────────────────────────

makeSuite('Comparison (gte)', (suite) => {
  suite
    .add('FixedPoint  a.gte(b)', () => {
      fpA.gte(fpB)
    })
    .add('BigNumber   a.gte(b)', () => {
      bnA.gte(bnB)
    })
    .add('BigInt      a >= b', () => {
      biA >= biB
    })
})

// ─── 10. Negation ──────────────────────────────────────────────────────────────

makeSuite('Negation', (suite) => {
  suite
    .add('FixedPoint  a.neg()', () => {
      fpA.neg()
    })
    .add('BigNumber   a.negated()', () => {
      bnA.negated()
    })
    .add('BigInt      -a', () => {
      -biA
    })
})

// ─── 11. Absolute value ────────────────────────────────────────────────────────

makeSuite('Absolute value', (suite) => {
  suite
    .add('FixedPoint  a.abs()', () => {
      fpNeg.abs()
    })
    .add('BigNumber   a.abs()', () => {
      bnNeg.abs()
    })
    .add('BigInt      manual abs', () => {
      biNeg < 0n ? -biNeg : biNeg
    })
})

// ─── 12. Square root ───────────────────────────────────────────────────────────

makeSuite('Square root', (suite) => {
  suite
    .add('FixedPoint  a.sqrt()', () => {
      fpSqrt.sqrt()
    })
    .add('BigNumber   a.sqrt()', () => {
      bnSqrt.sqrt()
    })
    // BigInt has no native sqrt — skip
})

// ─── 13. Rounding ──────────────────────────────────────────────────────────────

makeSuite('Rounding (half-up)', (suite) => {
  suite
    .add('FixedPoint  a.round(ROUND_HALF_UP)', () => {
      fpA.round(Rounding.ROUND_HALF_UP)
    })
    .add('BigNumber   a.integerValue(ROUND_HALF_UP)', () => {
      bnA.integerValue(BigNumber.ROUND_HALF_UP)
    })
})

makeSuite('Rounding (floor)', (suite) => {
  suite
    .add('FixedPoint  a.floor()', () => {
      fpA.floor()
    })
    .add('BigNumber   a.integerValue(ROUND_FLOOR)', () => {
      bnA.integerValue(BigNumber.ROUND_FLOOR)
    })
})

makeSuite('Rounding (ceil)', (suite) => {
  suite
    .add('FixedPoint  a.ceil()', () => {
      fpA.ceil()
    })
    .add('BigNumber   a.integerValue(ROUND_CEIL)', () => {
      bnA.integerValue(BigNumber.ROUND_CEIL)
    })
})

// ─── 14. Precision change ──────────────────────────────────────────────────────

makeSuite('Precision change (18 → 6)', (suite) => {
  suite
    .add('FixedPoint  a.toPrecision(6)', () => {
      fpA.toPrecision(6)
    })
    .add('BigNumber   a.dp(6)', () => {
      bnA.dp(6)
    })
    .add('BigInt      a / 10^12', () => {
      biA / (10n ** 12n)
    })
})

// ─── 15. To string ─────────────────────────────────────────────────────────────

makeSuite('To decimal string', (suite) => {
  suite
    .add('FixedPoint  a.toDecimalString()', () => {
      fpA.toDecimalString()
    })
    .add('BigNumber   a.toFixed(18)', () => {
      bnA.toFixed(18)
    })
    .add('BigInt      manual format', () => {
      const s = biA.toString()
      s.slice(0, -18) + '.' + s.slice(-18)
    })
})

// ─── 16. isZero / isPositive / isNegative ──────────────────────────────────────

makeSuite('Predicates (isZero, isPositive, isNegative)', (suite) => {
  suite
    .add('FixedPoint  isZero+isPositive+isNegative', () => {
      fpA.isZero()
      fpA.isPositive()
      fpA.isNegative()
    })
    .add('BigNumber   isZero+isPositive+isNegative', () => {
      bnA.isZero()
      bnA.isPositive()
      bnA.isNegative()
    })
    .add('BigInt      === 0n, > 0n, < 0n', () => {
      biA === 0n
      biA > 0n
      biA < 0n
    })
})

// ─── 17. Mixed-precision addition ──────────────────────────────────────────────

const fpA6 = fpFromDecimal('12345.678901', 6)
const fpB18 = fpFromDecimal('9876.543210987654321', 18)
const bnA6 = new BigNumber('12345.678901')
const bnB18 = new BigNumber('9876.543210987654321000')

makeSuite('Addition (mixed precision: 6 + 18)', (suite) => {
  suite
    .add('FixedPoint  a6.add(b18)', () => {
      fpA6.add(fpB18)
    })
    .add('BigNumber   a6.plus(b18)', () => {
      bnA6.plus(bnB18)
    })
    .add('BigInt      manual scale + add', () => {
      ;(biA * (10n ** 12n)) + biB
    })
})

// ─── 18. Large-number stress ───────────────────────────────────────────────────

makeSuite('Large number multiplication', (suite) => {
  suite
    .add('FixedPoint  large.mul(large)', () => {
      fpLarge.mul(fpLarge)
    })
    .add('BigNumber   large.times(large)', () => {
      bnLarge.times(bnLarge)
    })
    .add('BigInt      large * large / SCALE', () => {
      ;(biLarge * biLarge) / SCALE
    })
})

makeSuite('Large number division', (suite) => {
  suite
    .add('FixedPoint  large.div(a)', () => {
      fpLarge.div(fpA)
    })
    .add('BigNumber   large.div(a)', () => {
      bnLarge.div(bnA)
    })
    .add('BigInt      (large * SCALE) / a', () => {
      ;(biLarge * SCALE) / biA
    })
})

// ─── 19. Chained operations ────────────────────────────────────────────────────

makeSuite('Chained: (a + b) * a - b', (suite) => {
  suite
    .add('FixedPoint', () => {
      fpA.add(fpB).mul(fpA).sub(fpB)
    })
    .add('BigNumber', () => {
      bnA.plus(bnB).times(bnA).minus(bnB)
    })
    .add('BigInt', () => {
      ;(((biA + biB) * biA) / SCALE) - biB
    })
})

// ─── 20. Static min / max ──────────────────────────────────────────────────────

makeSuite('Static min / max', (suite) => {
  suite
    .add('FixedPoint  min + max', () => {
      FixedPoint.min(fpA, fpB, fpSmall, fpLarge, fpNeg)
      FixedPoint.max(fpA, fpB, fpSmall, fpLarge, fpNeg)
    })
    .add('BigNumber   min + max', () => {
      BigNumber.min(bnA, bnB, bnSmall, bnLarge, bnNeg)
      BigNumber.max(bnA, bnB, bnSmall, bnLarge, bnNeg)
    })
    .add('BigInt      manual min + max', () => {
      const vals = [biA, biB, biSmall, biLarge, biNeg]
      vals.reduce((m, e) => (e < m ? e : m))
      vals.reduce((m, e) => (e > m ? e : m))
    })
})

// ─── Run all suites ────────────────────────────────────────────────────────────

function pad(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length))
}

console.log('='.repeat(80))
console.log('  Fixed-Point Library Benchmarks')
console.log('  FixedPoint  vs  BigNumber.js  vs  plain BigInt')
console.log('  Precision: 18 decimals')
console.log('  Node.js ' + process.version)
console.log('='.repeat(80))
console.log()

let idx = 0
function runNext() {
  if (idx >= suites.length) {
    console.log('='.repeat(80))
    console.log('  All benchmarks completed.')
    console.log('='.repeat(80))
    return
  }

  const suite = suites[idx++]

  console.log(`── ${suite.name} ${'─'.repeat(Math.max(0, 76 - (suite.name || '').length))}`)
  console.log()

  suite
    .on('cycle', (event) => {
      const bench = event.target
      const hz = bench.hz ? bench.hz.toLocaleString('en', { maximumFractionDigits: 0 }) : '?'
      const rme = bench.stats ? bench.stats.rme.toFixed(2) : '?'
      const name = bench.name || ''
      console.log(`  ${pad(name, 44)} ${pad(hz, 16)} ops/sec  (\xb1${rme}%)`)
    })
    .on('complete', function () {
      const fastest = this.filter('fastest').map('name')
      console.log()
      console.log(`  => Fastest: ${fastest.join(', ')}`)
      console.log()
      runNext()
    })
    .run({ async: true })
}

runNext()
