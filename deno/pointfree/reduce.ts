import { ADT, Any, InferInner } from './types.ts';

export interface ReduceableKind {
  reduce<T2>(
    reducer: (accumulator: T2, value: Any) => T2,
    initialValue: T2,
  ): T2;
}
export function reduce<
  T extends ReduceableKind & ADT<unknown, unknown>,
  T2 = Any,
>(reducer: (accumulator: T2, value: InferInner<T>[0]) => T2, initialValue: T2) {
  return (reduceable: T): T2 => {
    return reduceable.reduce(reducer, initialValue);
  };
}
