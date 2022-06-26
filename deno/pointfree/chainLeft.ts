import { Any, InferADTSub, InferInner, Id, ADT } from './types.ts'

export interface ChainLeft {
  readonly chainLeft: (f: (value: Any) => Any) => Any
}

export function chainLeft<T extends ChainLeft & ADT<unknown, unknown>, U>(
  f: (
    value: InferInner<T>[1]
  ) => Id<U> extends Id<T> ? U : [U, `can't be chained with`, T]
): (
  fa: T
) => InferADTSub<T, InferInner<T>[0] | InferInner<U>[0], InferInner<U>[1]> {
  return (fa) => fa.chainLeft(f)
}
