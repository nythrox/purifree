import { ADT, Any, InferADT } from './types.ts';

export interface Altable {
  readonly alt: (other: Any) => Any;
}

export const alt = <T extends Altable & ADT<unknown, unknown>>(other: T) =>
  (fa: T): InferADT<T> => fa.alt(other);
