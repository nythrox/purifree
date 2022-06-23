import { Any, InferADTSub, InferInner, Id } from './types.ts'

export interface ChainLeft {
  readonly chainLeft: (f: (value: Any) => Any) => Any
}

export function chainLeft<T extends ChainLeft, U extends ChainLeft>(
  f: (
    value: InferInner<T>[1]
  ) => Id<U> extends Id<T> ? U : `${Id<U>} can't be chained with ${Id<T>}`
): (
  fa: T
) => InferADTSub<T, InferInner<T>[0] | InferInner<U>[0], InferInner<U>[1]> {
  return (fa) => fa.chainLeft(f)
}
