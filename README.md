# Fixed Point Library

A high-precision fixed-point math library for JavaScript and TypeScript, built around native `bigint` for maximum performance and precision.

## Features

- Arbitrary precision fixed-point arithmetic
- Built on JavaScript's native `bigint` type
- Comprehensive math operations
- No external dependencies
- TypeScript support

## Installation

```bash
# Using npm
npm install @hastom/fixed-point

# Using yarn
yarn add @hastom/fixed-point

# Using pnpm
pnpm add @hastom/fixed-point
```

## Basic Usage

```typescript
import { fpFromDecimal, fpFromInt } from '@hastom/fixed-point';

// Create fixed-point numbers with precision of 18 decimal places
const a = fpFromDecimal('123.456789', 18);
const b = fpFromDecimal('0.000000000000000001', 18); // Smallest possible value with precision of 18
const c = fpFromInt(100000000000000000000n, 18, 18); // Already scaled value with source and destination precision of 18

// Perform arithmetic operations
const sum = a.add(c);
console.log(sum.toDecimalString()); // '223.456789000000000000'

// Comparison
if (a.gt(b)) {
  console.log('a is greater than b');
}

// Convert to decimal string
console.log(a.toDecimalString()); // '123.456789000000000000'
```

## API Reference

### Factory Functions

#### `fpFromDecimal(src: number | string | bigint, dstPrecision: number): FixedPoint`

Creates a fixed-point number from a decimal value.

Parameters:
- `src`: The decimal value to convert (as a number, string, or bigint)
- `dstPrecision`: The precision (number of decimal places) for the resulting FixedPoint

```typescript
import { fpFromDecimal } from '@hastom/fixed-point';

// Create a fixed-point number with 18 decimal places
const num1 = fpFromDecimal('123.456789', 18);

// Create a fixed-point number with 10 decimal places
const num2 = fpFromDecimal('3.1415926535', 10);

// Can also use a number as input (but be aware of JS floating point limitations)
const num3 = fpFromDecimal(123.456, 18);

// Or use a bigint (which will be scaled by the precision)
const num4 = fpFromDecimal(123n, 18); // Equivalent to 123.000000000000000000
```

#### `fpFromInt(src: number | string | bigint, srcPrecision: number, dstPrecision: number): FixedPoint`

Creates a fixed-point number from an already scaled integer value.

Parameters:
- `src`: The integer value (in an already scaled form)
- `srcPrecision`: The precision of the source integer
- `dstPrecision`: The precision for the resulting FixedPoint

```typescript
import { fpFromInt } from '@hastom/fixed-point';

// Create a fixed-point number from a scaled integer
// 100000000000000000000n represents 100.0 with 18 decimal places
const num1 = fpFromInt(100000000000000000000n, 18, 18);

// Convert from one precision to another
// 12345 represents 1.2345 with 4 decimal places, converting to 8 decimal places
const num2 = fpFromInt(12345, 4, 8); // Will be 1.23450000 with 8 decimal places

// Using a string for a very large number
const num3 = fpFromInt('123456789012345678901234567890', 18, 18);
```

### FixedPoint Methods

#### Arithmetic Operations

##### `add(other: FixedPoint): FixedPoint`

Adds two fixed-point numbers.

```typescript
const a = fpFromDecimal('10.5', 18);
const b = fpFromDecimal('20.3', 18);
const result = a.add(b);
console.log(result.toDecimalString()); // '30.800000000000000000'
```

##### `sub(other: FixedPoint): FixedPoint`

Subtracts a value from the fixed-point number.

```typescript
const a = fpFromDecimal('30.5', 18);
const b = fpFromDecimal('10.3', 18);
const result = a.sub(b);
console.log(result.toDecimalString()); // '20.200000000000000000'
```

##### `mul(other: FixedPoint): FixedPoint`

Multiplies the fixed-point number by another value.

```typescript
const a = fpFromDecimal('2.5', 18);
const b = fpFromDecimal('3', 18);
const result = a.mul(b);
console.log(result.toDecimalString()); // '7.500000000000000000'
```

##### `div(other: FixedPoint): FixedPoint`

Divides the fixed-point number by another value.

```typescript
const a = fpFromDecimal('10', 18);
const b = fpFromDecimal('2.5', 18);
const result = a.div(b);
console.log(result.toDecimalString()); // '4.000000000000000000'
```


##### `neg(): FixedPoint`

Negates the fixed-point number.

```typescript
const a = fpFromDecimal('10.5', 18);
const result = a.neg();
console.log(result.toDecimalString()); // '-10.500000000000000000'
```

##### `abs(): FixedPoint`

Returns the absolute value of the fixed-point number.

```typescript
const a = fpFromDecimal('-10.5', 18);
const result = a.abs();
console.log(result.toDecimalString()); // '10.5'
```

##### `sqrt(): FixedPoint`

Calculates the square root of the fixed-point number using the Newton-Raphson method.

```typescript
// Perfect squares
const a = fpFromDecimal('25', 18);
const result = a.sqrt();
console.log(result.toDecimalString()); // '5.000000000000000000'

// Non-perfect squares
const b = fpFromDecimal('2', 18);
const result2 = b.sqrt();
console.log(result2.toDecimalString()); // '1.414213562373095049'

// Decimal numbers
const c = fpFromDecimal('0.25', 18);
const result3 = c.sqrt();
console.log(result3.toDecimalString()); // '0.500000000000000000'

// Error handling - negative numbers throw an error
const d = fpFromDecimal('-1', 18);
try {
  d.sqrt(); // Throws: 'Cannot calculate square root of negative number'
} catch (error) {
  console.error(error.message);
}
```

**Note**: The `sqrt()` method preserves the precision of the original number and uses higher working precision internally for accurate calculations. There's also a `squareRoot()` alias available.

#### Comparison Operations

##### `eq(other: FixedPoint): boolean`

Checks if the fixed-point number is equal to another value.

```typescript
const a = fpFromDecimal('10.5', 18);
const b = fpFromDecimal('10.5', 18);
console.log(a.eq(b)); // true
```

##### `gt(other: FixedPoint): boolean`

Checks if the fixed-point number is greater than another value.

```typescript
const a = fpFromDecimal('10.5', 18);
const b = fpFromDecimal('5.2', 18);
console.log(a.gt(b)); // true
```

##### `gte(other: FixedPoint): boolean`

Checks if the fixed-point number is greater than or equal to another value.

```typescript
const a = fpFromDecimal('10.5', 18);
const b = fpFromDecimal('10.5', 18);
console.log(a.gte(b)); // true
```

##### `lt(other: FixedPoint): boolean`

Checks if the fixed-point number is less than another value.

```typescript
const a = fpFromDecimal('5.2', 18);
const b = fpFromDecimal('10.5', 18);
console.log(a.lt(b)); // true
```

##### `lte(other: FixedPoint): boolean`

Checks if the fixed-point number is less than or equal to another value.

```typescript
const a = fpFromDecimal('10.5', 18);
const b = fpFromDecimal('10.5', 18);
console.log(a.lte(b)); // true
```

#### Utility Methods

##### `toString(): string`

Returns the base fixed-point representation (the internal scaled value as a string).

```typescript
const a = fpFromDecimal('10.5', 18);
console.log(a.toString()); // '10500000000000000000' (for precision of 18)
```

##### `toDecimalString(): string`

Converts the fixed-point number to a decimal string.

```typescript
const a = fpFromDecimal('10.5', 18);
console.log(a.toDecimalString()); // '10.500000000000000000'
```

##### `toDecimal(): number`

Converts the fixed-point number to a JavaScript number.

```typescript
const a = fpFromDecimal('10.54321', 18);
console.log(a.toDecimal()); // 10.54321
```

##### `isZero(): boolean`

Checks if the fixed-point number is zero.

```typescript
const a = fpFromDecimal('0', 18);
console.log(a.isZero()); // true
```

##### `isPositive(): boolean`

Checks if the fixed-point number is positive.

```typescript
const a = fpFromDecimal('10.5', 18);
console.log(a.isPositive()); // true
```

##### `isNegative(): boolean`

Checks if the fixed-point number is negative.

```typescript
const a = fpFromDecimal('-10.5', 18);
console.log(a.isNegative()); // true
```

##### `toPrecision(precision: number, rounding?: Rounding): FixedPoint`

Converts the fixed-point number to a different precision, returning a new FixedPoint instance.

```typescript
import { Rounding } from '@hastom/fixed-point';

const a = fpFromDecimal('10.54321', 18);
const result = a.toPrecision(2); // Default rounding is ROUND_DOWN
console.log(result.toDecimalString()); // '10.54'

// With explicit rounding mode
const rounded = a.toPrecision(2, Rounding.ROUND_HALF_UP);
console.log(rounded.toDecimalString()); // '10.54'

// Increase precision (no rounding needed)
const expanded = a.toPrecision(20);
console.log(expanded.toDecimalString()); // '10.54321000000000000000'
```

##### `setPrecision(precision: number, rounding?: Rounding): void`

Modifies the precision of the current FixedPoint instance in place.

```typescript
import { Rounding } from '@hastom/fixed-point';

const a = fpFromDecimal('10.987654', 18);
console.log(a.toDecimalString()); // '10.987654000000000000'

// Reduce precision with default rounding (ROUND_DOWN)
a.setPrecision(3);
console.log(a.toDecimalString()); // '10.987'

// Create another instance to show different rounding
const b = fpFromDecimal('10.987654', 18);
b.setPrecision(3, Rounding.ROUND_HALF_UP);
console.log(b.toDecimalString()); // '10.988'

// Increase precision
b.setPrecision(10);
console.log(b.toDecimalString()); // '10.9880000000'
```

##### `round(mode?: Rounding): FixedPoint`

Rounds the fixed-point number to the nearest integer using the specified rounding mode.

```typescript
import { Rounding } from '@hastom/fixed-point';

const a = fpFromDecimal('10.7', 18);
const b = fpFromDecimal('-10.7', 18);
const c = fpFromDecimal('10.5', 18);
const d = fpFromDecimal('-10.5', 18);

// ROUND_UP - Away from zero
console.log(a.round(Rounding.ROUND_UP).toDecimalString()); // '11.000000000000000000'
console.log(b.round(Rounding.ROUND_UP).toDecimalString()); // '-11.000000000000000000'

// ROUND_DOWN - Towards zero (default)
console.log(a.round(Rounding.ROUND_DOWN).toDecimalString()); // '10.000000000000000000'
console.log(b.round(Rounding.ROUND_DOWN).toDecimalString()); // '-10.000000000000000000'

// ROUND_CEIL - Towards positive infinity
console.log(a.round(Rounding.ROUND_CEIL).toDecimalString()); // '11.000000000000000000'
console.log(b.round(Rounding.ROUND_CEIL).toDecimalString()); // '-10.000000000000000000'

// ROUND_FLOOR - Towards negative infinity
console.log(a.round(Rounding.ROUND_FLOOR).toDecimalString()); // '10.000000000000000000'
console.log(b.round(Rounding.ROUND_FLOOR).toDecimalString()); // '-11.000000000000000000'

// ROUND_HALF_UP - If halfway (.5), rounds away from zero
console.log(c.round(Rounding.ROUND_HALF_UP).toDecimalString()); // '11.000000000000000000'
console.log(d.round(Rounding.ROUND_HALF_UP).toDecimalString()); // '-11.000000000000000000'

// ROUND_HALF_DOWN - If halfway (.5), rounds towards zero
console.log(c.round(Rounding.ROUND_HALF_DOWN).toDecimalString()); // '10.000000000000000000'
console.log(d.round(Rounding.ROUND_HALF_DOWN).toDecimalString()); // '-10.000000000000000000'

// ROUND_HALF_EVEN - If halfway (.5), rounds to even neighbor (banker's rounding)
const e = fpFromDecimal('2.5', 18);
const f = fpFromDecimal('3.5', 18);
console.log(e.round(Rounding.ROUND_HALF_EVEN).toDecimalString()); // '2.000000000000000000'
console.log(f.round(Rounding.ROUND_HALF_EVEN).toDecimalString()); // '4.000000000000000000'
```

##### `floor(): FixedPoint`

Rounds down to the nearest integer (shorthand for `round(Rounding.ROUND_FLOOR)`).

```typescript
const a = fpFromDecimal('10.7', 18);
const b = fpFromDecimal('-10.3', 18);
console.log(a.floor().toDecimalString()); // '10.000000000000000000'
console.log(b.floor().toDecimalString()); // '-11.000000000000000000'
```

##### `ceil(): FixedPoint`

Rounds up to the nearest integer (shorthand for `round(Rounding.ROUND_CEIL)`).

```typescript
const a = fpFromDecimal('10.3', 18);
const b = fpFromDecimal('-10.7', 18);
console.log(a.ceil().toDecimalString()); // '11.000000000000000000'
console.log(b.ceil().toDecimalString()); // '-10.000000000000000000'
```

#### Rounding Modes

The library supports various rounding modes through the `Rounding` enum:

- **`ROUND_UP`**: Rounds away from zero
- **`ROUND_DOWN`**: Rounds towards zero (truncation)
- **`ROUND_CEIL`**: Rounds towards positive infinity
- **`ROUND_FLOOR`**: Rounds towards negative infinity
- **`ROUND_HALF_UP`**: Rounds to nearest neighbor, halfway cases away from zero
- **`ROUND_HALF_DOWN`**: Rounds to nearest neighbor, halfway cases towards zero
- **`ROUND_HALF_EVEN`**: Rounds to nearest neighbor, halfway cases to even neighbor (banker's rounding)
- **`ROUND_HALF_CEIL`**: Rounds to nearest neighbor, halfway cases towards positive infinity
- **`ROUND_HALF_FLOOR`**: Rounds to nearest neighbor, halfway cases towards negative infinity
