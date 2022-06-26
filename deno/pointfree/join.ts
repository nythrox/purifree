import { Any, InferADTSub, InferInner, NestedSameADT, ADT } from './types.ts'

export interface Joinable {
  readonly join: () => Any
}

export const join =
  <T extends Joinable & ADT<unknown, unknown>>() =>
  (
    seq: NestedSameADT<T>
  ): InferADTSub<
    T,
    InferInner<InferInner<T>[0]>[0],
    InferInner<T>[1] | InferInner<InferInner<T>[0]>[1]
  > =>
    seq.join()
