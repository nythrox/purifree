import { Either, Just } from '..'
import { pipe } from '../utils/function-utils'
import { HKT, URIS } from './hkt'

export interface ToEitherable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly toEither: <L>(left: L) => Either<L, A[0]>
}

export const toEither = <ToEitherM extends ToEitherable<any, any>, L = any>(
  left: L
) => (fa: ToEitherM): Either<L, ToEitherM['_A'][0]> => {
  return fa.toEither(left)
}

const toMaybeTest1 = pipe(Just(0), toEither(new Error('bad')))
