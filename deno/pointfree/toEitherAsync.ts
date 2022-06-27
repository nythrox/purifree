import { EitherAsync } from '../deps.ts';
import { Any, InferInner } from './types.ts';

export interface ToEitherAsync {
  readonly toEitherAsync: (left: Any) => EitherAsync<Any, Any>;
}

export function toEitherAsync<T extends ToEitherAsync, E>(left: E) {
  return (fa: T): EitherAsync<E, InferInner<T>[0]> => {
    return fa.toEitherAsync(left);
  };
}
