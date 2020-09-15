import { Just, Maybe } from '../Maybe'
import { Either, Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { pipe, flow } from './function-utils'
import { MaybeAsync } from '../MaybeAsync'
import { Tuple } from '../Tuple'
import { NonEmptyList } from '../NonEmptyList'
type sera = Either<Error, number> extends Mappable<number> ? true : false
type Mappable<T> = {
  map<T2>(f: (value: T) => T2): Mappable<T2>
}
// Try one - Doesnt work: Overload will always choose the first function
// interface Map {
//   <R, R2, L>(mapper: (val: R) => R2): (
//     m: EitherAsync<L, R>
//   ) => EitherAsync<L, R2>
//   <R, R2, L>(mapper: (val: R) => R2): (m: Either<L, R>) => Either<L, R2>

//   <T, T2>(mapper: (val: T, index: number, arr: NonEmptyList<T>) => T2): (
//     m: NonEmptyList<T>
//   ) => NonEmptyList<T2>
//   <T, T2>(mapper: (val: T) => T2): (m: Maybe<T>) => Maybe<T2>
//   <T, T2>(mapper: (val: T) => T2): (m: MaybeAsync<T>) => MaybeAsync<T2>
//   <T, T2>(mapper: (val: T) => T2): (m: Mappable<T>) => Mappable<T2>
//   <F, S, S2>(mapper: (val: S) => S2): (m: Tuple<F, S>) => Either<F, S2>
// }

// // Try two - Doesnt work: Overload will always choose the first function
// interface Map {
//   <T, T2>(mapper: (val: T) => T2): <L>(m: Either<L, T>) => Either<L, T2>
//   <T, T2>(mapper: (val: T) => T2): <L>(
//     m: EitherAsync<L, T>
//   ) => EitherAsync<L, T2>

//   <T, T2>(mapper: (val: T, index: number, arr: NonEmptyList<T>) => T2): (
//     m: NonEmptyList<T>
//   ) => NonEmptyList<T2>
//   <F, S, S2>(mapper: (val: S) => S2): (m: Tuple<F, S>) => Either<F, S2>
//   <T, T2>(mapper: (val: T) => T2): (m: Maybe<T>) => Maybe<T2>
//   <T, T2>(mapper: (val: T) => T2): (m: MaybeAsync<T>) => MaybeAsync<T2>
//   <T, T2>(mapper: (val: T) => T2): (m: Mappable<T>) => Mappable<T2>
// }

// // Try three - Doesnt work: Overload will always choose the last function
// interface Map {
//   <T, T2, L = unknown>(mapper: (val: T) => T2): MapS<T, T2, L>
// }

// interface MapS<T, T2, L> {
//   (m: Mappable<T>): Mappable<T2>
//   (m: Maybe<T>): Maybe<T2>
//   (m: Either<L, T>): Either<L, T2>
//   (m: EitherAsync<L, T>): EitherAsync<L, T2>
//   (m: NonEmptyList<T>): NonEmptyList<T2>
//   (m: MaybeAsync<T>): MaybeAsync<T2>
// }

// // Try four - Doesnt work: Overload will always choose the last function
// interface Map {
//   <T, T2>(mapper: (val: T) => T2): MapS3<T, T2>
// }

// interface MapS3<T, T2> {
//   (m: Mappable<T>): Mappable<T2>
//   (m: Maybe<T>): Maybe<T2>
//   <L>(m: Either<L, T>): Either<L, T2>
//   <L>(m: EitherAsync<L, T>): EitherAsync<L, T2>
//   (m: MaybeAsync<T>): MaybeAsync<T2>
//   (m: NonEmptyList<T>): NonEmptyList<T2>
// }

interface Map {
  <M, T = get_T_ofMonad<M>, T2 = any>(mapper: (val: T) => T2): (
    monad: M
  ) => get_Return_ofMonad<M, T2>
}

type get_T_ofMonad<M> = M extends Either<any, infer T>
  ? T
  : M extends EitherAsync<any, infer T>
  ? T
  : M extends Maybe<infer T>
  ? T
  : M extends MaybeAsync<infer T>
  ? T
  : M extends NonEmptyList<infer T>
  ? T
  : M extends Mappable<infer T>
  ? T
  : never

type get_Return_ofMonad<M, T2> = M extends Either<infer L, any>
  ? Either<L, T2>
  : M extends EitherAsync<infer L, any>
  ? EitherAsync<L, T2>
  : M extends Maybe<any>
  ? Maybe<T2>
  : M extends MaybeAsync<any>
  ? MaybeAsync<T2>
  : M extends NonEmptyList<any>
  ? NonEmptyList<T2>
  : M extends Mappable<any>
  ? Mappable<T2>
  : never

export const map: Map = ((mapper: any) => (m: any) => {
  return m.map(mapper)
}) as any

const v = pipe(
  Right<number, Error>(1),
  map((e) => Just(e)),
  map((e) => 'hi'),
  map((e) => e)
  // mapLeft((err) => new Error('bad num'))
)
const d = pipe(
  EitherAsync.liftEither(Right(0)),
  map((e) => 'hi')
  // mapLeft((err) => new Error('bad num'))
)

const b = pipe(
  NonEmptyList([0]),
  map((num) => num * 2)
)
const c = pipe(
  Just(0),
  map((num) => 'hi'),
  map((e) => Right(e))
)
