import { ADT, Any, InferADTSub, InferInner } from './types.ts';

export interface Bimappable {
  readonly bimap: (
    f: (value: unknown) => unknown,
    g: (value: unknown) => unknown,
  ) => Any;
}

export function bimap<T extends Bimappable & ADT<unknown, unknown>, B, C>(
  f: (value: InferInner<T>[1]) => C,
  g: (value: InferInner<T>[0]) => B,
) {
  return (fa: T): InferADTSub<T, B, C> => {
    return fa.bimap(f, g);
  };
}
