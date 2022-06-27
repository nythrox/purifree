import { ADT, Any, InferInner } from './types.ts';

export interface Extractable {
  readonly extract: () => Any;
}

export function extract<T extends Extractable & ADT<unknown, unknown>>() {
  return (fa: T): InferInner<T>[1] | InferInner<T>[0] => fa.extract();
}
