import { ADT, Any, InferADT, InferInner } from './types.ts';

type IfRight = {
  readonly ifRight: (effect: (a: unknown) => unknown) => Any;
};

export function ifRight<T extends IfRight & ADT<unknown, unknown>>(
  effect: (a: InferInner<T>[0]) => unknown,
) {
  return (fa: T): InferADT<T> => fa.ifRight(effect);
}
