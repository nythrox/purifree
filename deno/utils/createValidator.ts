import { NonEmptyList, Either, EitherAsync } from 'purify'
import { pipe } from './function-utils.ts'
import { swap } from '../pointfree/swap.ts'

export const createValidator =
  <A, L, R>(
    validator: (value: A) => Either<L, R>,
    ...validators: ((value: A) => Either<L, R>)[]
  ) =>
  (arg: A) => {
    const results = [validator, ...validators].map((validator) =>
      validator(arg).swap()
    ) as NonEmptyList<Either<R, L>>
    return pipe(results, Either.sequence, swap())
  }
export const createAsyncValidator =
  <A, L, R>(
    validator: (value: A) => EitherAsync<L, R>,
    ...validators: ((value: A) => EitherAsync<L, R>)[]
  ) =>
  (arg: A) => {
    const results = [validator, ...validators].map((validator) =>
      validator(arg).swap()
    ) as NonEmptyList<EitherAsync<R, L>>
    return pipe(results, EitherAsync.sequence, swap())
  }
