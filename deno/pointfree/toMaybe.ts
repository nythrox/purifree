import { Maybe } from '../deps.ts';
import { InferInner } from './types.ts';

export function toMaybe<R extends ToMaybe>(either: R): Maybe<InferInner<R>[0]> {
  return either.toMaybe();
}

export interface ToMaybe {
  readonly toMaybe: () => Maybe<unknown>;
}
