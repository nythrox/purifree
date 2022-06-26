import { ADT, InferInner, InferADTSub, Any, Id } from './types.ts'

export interface ApKind {
  readonly ap: (other: Any) => Any
}

export const ap =
  <
    T extends ApKind & ADT<unknown, unknown>,
    U extends ADT<(a: InferInner<T>[0]) => unknown, unknown>
  >(
    other: Id<U> extends Id<T> ? U : [U, `can't be applied with`, T]
  ) =>
  (fa: T): InferADTSub<T, ReturnType<InferInner<U>[0]>, InferInner<U>[1]> =>
    fa.ap(other)
