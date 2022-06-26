import { Any, InferADTSub, InferInner, Id, ADT } from './types.ts'

export interface ChainLeft {
  readonly chainLeft: (f: (value: Any) => Any) => Any
}
// TODO: fix for promiselike
export function chainLeft<
  T extends ChainLeft & ADT<unknown, unknown>,
  U extends ChainLeft & ADT<unknown, unknown>
>(
  f: (
    value: InferInner<T>[1]
  ) => Id<U> extends Id<T> ? U : `${Id<U>} can't be chained with ${Id<T>}`
): (
  fa: T
) => InferADTSub<T, InferInner<T>[0] | InferInner<U>[0], InferInner<U>[1]> {
  return (fa) => fa.chainLeft(f)
}
