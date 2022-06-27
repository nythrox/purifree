import { ADT, Any, InferADTSub, InferInner } from './types.ts';

export interface Swappable {
  readonly swap: () => Any;
}

export function swap<S extends Swappable & ADT<unknown, unknown>>() {
  return (fa: S): InferADTSub<S, InferInner<S>[1], InferInner<S>[0]> => {
    return fa.swap();
  };
}
