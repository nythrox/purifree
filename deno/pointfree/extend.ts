import { ADT, Any, InferADTSub, InferInner } from './types.ts';

export interface Extendable1 {
  readonly extend: (f: (a: Any) => Any) => Any;
}

export function extend<T extends Extendable1 & ADT<unknown, unknown>, U>(
  f: (a: T) => U,
) {
  return (fa: T): InferADTSub<T, U, InferInner<T>[1]> => fa.extend(f);
}
