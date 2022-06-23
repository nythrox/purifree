import { Any, InferADTSub, InferInner, Id } from './types.ts'

export interface Chainable {
  readonly chain: (f: (value: Any) => Any) => Any
}

export function chain<T extends Chainable, U extends Chainable>(
  f: (
    value: InferInner<T>[0]
  ) => Id<U> extends Id<T> ? U : `${Id<U>} can't be chained with ${Id<T>}`
): (
  fa: T
) => InferADTSub<T, InferInner<U>[0], InferInner<T>[1] | InferInner<U>[1]> {
  return (fa) => fa.chain(f)
}
