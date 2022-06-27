import { EitherAsync } from 'purify'
import { Any, InferInner } from './types.ts'

export interface ToEitherAsync {
  readonly toEitherAsync: (left: Any) => EitherAsync<Any, Any>
}

export const toEitherAsync =
  <T extends ToEitherAsync, E>(left: E) =>
  (fa: T): EitherAsync<E, InferInner<T>[0]> => {
    return fa.toEitherAsync(left)
  }
