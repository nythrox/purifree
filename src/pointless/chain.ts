import { Either, Left, Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { Tuple } from '../Tuple'
import { pipe } from './function-utils'
import {
  HKT,
  ReplaceFirst,
  ReplaceFirstAndReplaceSecondIfSecondIsNever,
  ReplaceFirstAndSecond,
  SumSecondArg,
  Type,
  URIS
} from './hkt_tst'
import { FunctorKind } from './map'

export interface MonadKind<F extends URIS, A extends any[]>
  extends FunctorKind<F, A> {
  readonly chain: <B>(
    f: (a: A[0]) => Type<F, ReplaceFirst<A, B>>
  ) => Type<F, ReplaceFirst<A, B>>
}

export interface Chainable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly chain: <B>(
    f: (
      a: A[0]
    ) => // | Type<F, ReplaceFirst<A, B>>
    Type<F, ReplaceFirstAndReplaceSecondIfSecondIsNever<A, B, never>> // TODO: EitherAsync<never,  B> is not assignable to EitherAsync<any, B>. any is not never. This was the solution
  ) => Type<F, ReplaceFirst<A, B>>
}

export const chain = <
  Monad extends Chainable<any, any>,
  URI extends URIS = Monad['_URI'],
  Generics extends any[] = Monad['_A'],
  B = any
>(
  f: (
    a: Monad['_A'][0]
  ) => HKT<URI extends infer U ? U : never, ReplaceFirst<Generics, B>> // delay the infer U, so it can get the monads URI
) => (fa: Monad): Type<URI, ReplaceFirst<Generics, B>> => {
  return fa.chain(f)
}

type sla = HKT<'EitherAsync', any> extends HKT<'Either', any> ? true : false
type wo = EitherAsync<any, any>['_URI']
/**
 * This chain is more flexible: allows the L argument in Either<L,R> to be of a different type, and the new returned monad is Either<L1 | L2, R>.
 * Good for error reporting: Either<DatabaseError | ValidationError, User>
 * @example
 * pipe(
 *   Right(10) as Either<string, number>,
 *   chainFlex((num) => Right(num) as Either<Error, number>),
 *   chainFlex(num => Right(num) as Either<ValidationError, number>)
 * ) // Either<string | Error | ValidationError, number>
 */

export const chainFlex = <
  Monad extends Chainable<any, any>,
  URI extends URIS = Monad['_URI'],
  B = any,
  C = any
>(
  f: (a: Monad['_A'][0]) => Chainable<URI, [B, C, ...any]>
) => (
  fa: Monad
): Type<URI, ReplaceFirstAndSecond<Monad['_A'], B, Monad['_A'][1] | C>> => {
  return fa.chain(f)
}

const sla = pipe(
  Right<number, Error>(0),
  chain(() => Right<string, Error>('hi'))
  // chain(() => Left('hi'))
)
const sla2 = pipe(
  EitherAsync.liftEither(Right(0)),
  chain(() => EitherAsync.liftEither(Right('')))
)
const restura2 = pipe(
  // Future(
  Right<{ name: string }, Error>({
    name: 'jason'
  }),
  // ),
  // (e) => {}
  // map(e => {})
  chain((user) => Left(Error('whataever')))
)
