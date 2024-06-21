## Library for operating with fixed point decimals

It's fully based on native BigInt and does not have any fallbacks (or dependencies)  
As fast as pure bigint math

### Install
```bash
npm i @hastom/fixed-point
```

### Usage

Definition

```ts
import { FP, FixedPoint } from '@hastom/fixed-point'

const a = new FixedPoint(1_000n, 3n) // means 1.000, base = 1000, precision = 3
const b = FP(1.212) // means 1.212, base 1212, precision = 3
const c = FP([90_09, 2]) // means 90.09, base 9090, precision = 2
```

Math
```ts
import { FP, FixedPoint } from '@hastom/fixed-point'

const d = a.add(b) // result 2.212, base = 2212, precision = 3
const e = a.sub(c) // result -89.09, base -8909, precision = 3
const f = b.mul(c) // result 109.189, base 109189, precision = 3
const g = c.div(b) // result 74.33, base 7433, precision = 2
const h = e.neg() // result 89.09, base 8909, precision = 3
const i = e.abs() // result 89.09, base 8909, precision = 3
```
As you can see, by default all maths keeps first arg precision.  
This behavior can be modified by extending base `FixedPoint` class, as well as default precision, for parsing plain numeric types

```ts
import { FP, FixedPoint, parseNumeric } from '@hastom/fixed-point'

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
const d = a.div([0.025, 12]) // result 40.000000000000, base 40000000000000, precision = 12
```
