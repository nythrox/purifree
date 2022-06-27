import { ADT, Any, InferADTSub, InferInner } from './types.ts';

export interface Map {
  map: (f: (a: unknown) => unknown) => Any;
}
export function map<T extends Map & ADT<unknown, unknown>, U>(
  f: (a: InferInner<T>[0]) => U,
): (fa: T) => InferADTSub<T, U, InferInner<T>[1]> {
  return (fa) => fa.map(f);
}
