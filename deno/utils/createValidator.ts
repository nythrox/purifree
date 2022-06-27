import { Either, EitherAsync, NonEmptyList } from '../deps.ts';
import { pipe } from './function-utils.ts';
import { swap } from '../pointfree/swap.ts';

export function createValidator<A, L, R>(
  validator: (value: A) => Either<L, R>,
  ...validators: ((value: A) => Either<L, R>)[]
) {
  return (arg: A) => {
    const results = [validator, ...validators].map((validator) =>
      validator(arg).swap()
    ) as NonEmptyList<Either<R, L>>;
    return pipe(results, Either.sequence, swap());
  };
}
export function createAsyncValidator<A, L, R>(
  validator: (value: A) => EitherAsync<L, R>,
  ...validators: ((value: A) => EitherAsync<L, R>)[]
) {
  return (arg: A) => {
    const results = [validator, ...validators].map((validator) =>
      validator(arg).swap()
    ) as NonEmptyList<EitherAsync<R, L>>;
    return pipe(results, EitherAsync.sequence, swap());
  };
}
