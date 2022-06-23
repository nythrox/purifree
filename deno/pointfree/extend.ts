import { Any, InferADTSub, InferInner, ADT } from './types.ts'

export interface Extendable1 {
  readonly extend: (f: (a: Any) => Any) => Any
}

export const extend1 =
  <T extends Extendable1 & ADT<unknown, unknown>, U>(f: (a: T) => U) =>
  (fa: T): InferADTSub<T, U, InferInner<T>[1]> =>
    fa.extend(f)
