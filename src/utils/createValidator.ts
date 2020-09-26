import { EitherAsync, sequence } from '..'
import { Either } from '../Either'
import { NonEmptyList } from '../NonEmptyList'
import { pipe } from './function-utils'
import { swap } from '../pointfree/swap'

export const createValidator = <A, L, R>(
  validator: (value: A) => Either<L, R>,
  ...validators: ((value: A) => Either<L, R>)[]
) => (arg: A) => {
  const results = [validator, ...validators].map((validator) =>
    validator(arg).swap()
  ) as NonEmptyList<Either<R, L>>
  return pipe(results, sequence(Either.of), swap())
}
export const createAsyncValidator = <A, L, R>(
  validator: (value: A) => EitherAsync<L, R>,
  ...validators: ((value: A) => EitherAsync<L, R>)[]
) => (arg: A) => {
  const results = [validator, ...validators].map((validator) =>
    validator(arg).swap()
  ) as NonEmptyList<EitherAsync<R, L>>
  return pipe(results, sequence(EitherAsync.of), swap())
}
