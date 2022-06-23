import { ADT, Any, InferInner } from './types.ts'

export interface Extractable {
  readonly extract: () => Any
}

export const extract =
  <T extends Extractable & ADT<unknown, unknown>>() =>
  (fa: T): InferInner<T>[1] | InferInner<T>[0] =>
    fa.extract()
