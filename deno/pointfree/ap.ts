import { ADT, Any, Id, InferADTSub, InferInner, SyncADT } from './types.ts';

export interface ApKind {
  readonly ap: (other: Any) => Any;
}

type ApKinds<T> =
  | ADT<(a: InferInner<T>[0]) => unknown, unknown>
  | PromiseLike<SyncADT<(a: InferInner<T>[0]) => unknown, unknown>>;

export function ap<
  T extends ApKind & ADT<unknown, unknown>,
  U extends ApKinds<T>,
>(other: Id<U> extends Id<T> ? U : [U, `can't be applied with`, T]) {
  return (
    fa: T,
  ): InferADTSub<T, ReturnType<InferInner<U>[0]>, InferInner<U>[1]> =>
    fa.ap(other);
}
