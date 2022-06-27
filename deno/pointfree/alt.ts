import { ADT, Any, InferADT } from './types.ts';

export interface Altable {
  readonly alt: (other: Any) => Any;
}

export function alt<T extends Altable & ADT<unknown, unknown>>(other: T) {
  return (fa: T): InferADT<T> => fa.alt(other);
}
