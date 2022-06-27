import { Either } from '../deps.ts';
import { InferInner } from './types.ts';

export const toEither = <E>(left: E) =>
  <R extends ToEither>(maybe: R): Either<E, InferInner<R>[0]> =>
    maybe.toEither(left);

export interface ToEither {
  readonly toEither: <L>(left: L) => Either<L, unknown>;
}
