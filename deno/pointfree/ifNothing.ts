import { InferADT, ADT, Any } from './types.ts'

type IfNothing = {
  readonly ifNothing: (effect: () => unknown) => Any
}

export function ifNothing<T extends IfNothing & ADT<unknown, unknown>>(
  effect: () => unknown
) {
  return (fa: T): InferADT<T> => fa.ifNothing(effect)
}
