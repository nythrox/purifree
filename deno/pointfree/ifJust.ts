import { ADT, Any, InferADT, InferInner } from './types.ts';

type IfJust = {
  readonly ifJust: (fn: (a: unknown) => unknown) => Any;
};

export function ifJust<T extends IfJust & ADT<unknown, unknown>>(
  effect: (a: InferInner<T>[0]) => unknown,
) {
  return (fa: T): InferADT<T> => fa.ifJust(effect);
}
