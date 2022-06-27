import { MaybeAsync } from '../deps.ts';
import { Any, InferInner } from './types.ts';

export interface ToMaybeAsync {
  readonly toMaybeAsync: () => MaybeAsync<Any>;
}

export function toMaybeAsync<T extends ToMaybeAsync>() {
  return (fa: T): MaybeAsync<InferInner<T>[0]> => {
    return fa.toMaybeAsync();
  };
}
