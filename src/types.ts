import { FixedPoint } from './index'

export type Base = number | string | bigint
export type Precision = number | bigint
export type Numeric = [base: Base, precision: Precision] | Base
export type FPParser = (n: FixedPoint | Numeric, defaultPrecision?: Precision) => FixedPoint
