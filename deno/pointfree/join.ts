import { ADT, Any, InferADTSub, InferInner, NestedSameADT } from './types.ts';

export interface Joinable {
  readonly join: () => Any;
}

export function join<T extends Joinable & ADT<unknown, unknown>>() {
  return (
    seq: NestedSameADT<T>,
  ): InferADTSub<
    T,
    InferInner<InferInner<T>[0]>[0],
    InferInner<T>[1] | InferInner<InferInner<T>[0]>[1]
  > => seq.join();
}
