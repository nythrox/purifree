import { Maybe } from 'purify'
import { InferInner } from './types.ts'
export const toMaybe = <R extends ToMaybe>(
  either: R
): Maybe<InferInner<R>[0]> => either.toMaybe()

export interface ToMaybe {
  readonly toMaybe: () => Maybe<unknown>
}
