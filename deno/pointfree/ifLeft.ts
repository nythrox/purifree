import { ADT, Any, InferADT, InferInner } from './types.ts';

type IfLeft = {
  readonly ifLeft: (effect: (a: unknown) => unknown) => Any;
};

export function ifLeft<T extends IfLeft & ADT<unknown, unknown>>(
  effect: (a: InferInner<T>[1]) => unknown,
) {
  return (fa: T): InferADT<T> => fa.ifLeft(effect);
}
