## Library for operating with fixed point decimals

It's fully based on native BigInt and does not have any fallbacks (or dependencies)  
As fast as pure bigint math

Install
```bash
npm i @hastom/fixed-point
```

Use

```ts
import { FixedPoint } from '@hastom/fixed-point'

const a = new FixedPoint(1_200000n, 6) // means 1.2 with precision 6
const b = FixedPoint.fromDecimal(0.3232, 5) // means 0.3232 with precision 5
// it modifies a (!)
a.add(b)
console.log(a.getBase()) // 1523200n means 1.5232 with precision 6
// note that it always keeps first operand precision
console.log(a.toString()) // "1523200"
console.log(a.toDecimal()) // 1.5232
console.log(a.toDecimalString()) // "1.523200"

// all basic math returns self, so chaining is available
a
  .add(b)
  .sub(b)
  .mul(b)
  .div(b)

// comparisons return boolean
a.eq(b)
a.gt(b)
a.lt(b)
a.gte(b)
a.lte(b)
```
