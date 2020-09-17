import { Either, Left, Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { Just, Maybe } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { NonEmptyList } from '../NonEmptyList'
import { Tuple } from '../Tuple'
import { flow, identity, pipe } from './function-utils'
import { match } from './map'

export interface HKT<F, A extends any[]> {
  _URI: F
  _A: A
}
export type URIS = keyof URI2HKT<any>
export type ReplaceFirst<Arr extends any[], T> = Arr extends [
  infer _Head,
  ...infer Rest
]
  ? [T, ...Rest]
  : []
export type Type<URI extends URIS, A extends any[]> = URI2HKT<A>[URI]
// Types are sorted by order of priority, not of placement (type #1 is mapped, type #1 is mapLeft, etc)
export interface URI2HKT<Types extends any[]> {}
export interface Functor1<F extends URIS> {
  map: <A, B>(f: (a: A) => B, fa: Type<F, [A]>) => Type<F, [B]>
}

export interface FunctorKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly map: <B>(f: (a: A[0]) => B) => Type<F, ReplaceFirst<A, B>>
}

export type of<URI extends URIS> = <T>(value: T) => ApKind<URI, [T, ...any]>

export interface SequenceableKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  // this is [ Either<L,R> ]
  readonly sequence: <Ap extends ApKind<any, any>>(
    this: Type<F, ReplaceFirst<A, Ap>>,
    of: of<Ap['_URI']>
  ) => Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Type<F, Ap['_A'][0]>>>
}

export interface ApKind<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly ap: <R2>(
    other: Type<F, ReplaceFirst<A, (value: A[0]) => R2>>
  ) => Type<F, ReplaceFirst<A, R2>>
}
export interface MonadKind<F extends URIS, A extends any[]>
  extends FunctorKind<F, A> {
  readonly chain: <B>(
    f: (a: A[0]) => Type<F, ReplaceFirst<A, B>>
  ) => Type<F, ReplaceFirst<A, B>>
}
export interface GeneratableKind<F extends URIS, A extends any[]>
  extends MonadKind<F, A> {
  [Symbol.iterator]: () => Iterator<Type<F, A>, A[0], any>
}
interface ReduceableKind<F extends URIS, A extends any[]> extends HKT<F, A> {
  reduce<T2>(
    reducer: (accumulator: T2, value: A[0]) => T2,
    initialValue: T2
  ): T2
}
const map = <Functor extends FunctorKind<any, any>, B = any>(
  f: (a: Functor['_A'][0]) => B
) => (fa: Functor): Type<Functor['_URI'], ReplaceFirst<Functor['_A'], B>> => {
  return fa.map(f)
}
const ap = <Ap extends ApKind<any, any>, B = any>(
  other: ApKind<Ap['_URI'], ReplaceFirst<Ap['_A'], (value: Ap['_A'][0]) => B>>
) => (fa: Ap): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], B>> => {
  return fa.ap(other)
}

const sequence = <
  Sequenceable extends SequenceableKind<any, [ApKind<any, any>, ...any]>,
  Values = Sequenceable extends HKT<any, infer Args> ? Args : never,
  Ap0 = Values extends any[] ? Values[0] : never,
  Ap = Ap0 extends ApKind<infer ApUri, infer ApArgs>
    ? ApKind<ApUri, ApArgs>
    : never
>(
  of: Ap extends ApKind<any, any> ? of<Ap['_URI']> : never
) => (
  seq: Sequenceable
): Ap extends ApKind<any, any>
  ? Type<
      Ap['_URI'],
      ReplaceFirst<Ap['_A'], Type<Sequenceable['_URI'], Ap['_A']>>
    >
  : never => {
  return seq.sequence(of)
}

const reduce = <Reduceable extends ReduceableKind<any, any>, T2 = any>(
  reducer: (accumulator: T2, value: Reduceable['_A'][0]) => T2,
  initialValue: T2
) => (reduceable: Reduceable): T2 => {
  return reduceable.reduce(reducer, initialValue)
}
const chain = <Monad extends MonadKind<any, any>, B = any>(
  f: (a: Monad['_A']) => MonadKind<Monad['_URI'], ReplaceFirst<Monad['_A'], B>>
) => (fa: Monad): Type<Monad['_URI'], ReplaceFirst<Monad['_A'], B>> => {
  return fa.map(f)
}
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type NoUnion<Key> =
  // If this is a simple type UnionToIntersection<Key> will be the same type, otherwise it will an intersection of all types in the union and probably will not extend `Key`
  [Key] extends [UnionToIntersection<Key>] ? Key : never

function Do<
  Generatable extends GeneratableKind<any, any>,
  URI extends URIS = Generatable['_URI'],
  R = any,
  IsUnion = NoUnion<URI> extends never ? true : false
>(
  fun: () => Generator<Generatable, R, any>
): IsUnion extends true
  ? never
  : Type<URI, ReplaceFirst<Generatable['_A'], R>> {
  return null as any
}
type AssertEqual<A, B> = A extends B ? true : false
type test1 = AssertEqual<Either<any, any>, HKT<any, any>>
type test2 = AssertEqual<HKT<any, any>, Either<any, any>>
type test3 = AssertEqual<Type<'Either', any>, Either<any, any>>

const v = Do(function* () {
  const h = yield* Right(10)
  const w = yield* Left(Error())
  const hz = yield* Left('Error()')
  return 'jasno'
})

const chainableForAll1 = Right(0)
  .map((num) => num * 2)
  .caseOf({
    Right: () => Just(5),
    Left: () => Just(5)
  })
  .map((num) => num * 2)
  .caseOf({
    Just: (n) => Tuple(n, 2),
    Nothing: () => Tuple(1, 2)
  })
  .map((scnd) => scnd * 2)

const chainableForAll2 = EitherAsync.liftEither(
  Right<Tuple<number, number>, Error>(chainableForAll1)
).map((e) => e.reduce((prev, curr) => prev + curr, 0))

const pointfreeForAll = pipe(
  // Either
  Right(0),
  map((num) => num * 2),
  match({
    Right: () => Just(5),
    Left: () => Just(5)
  }),
  // Just
  map((num) => num * 2),
  match({
    Just: (n) => Tuple(n, 2),
    Nothing: () => Tuple(1, 2)
  }),
  // Tuple
  map((scnd) => scnd * 2),
  // EitherAsync
  (tuple) => EitherAsync.liftEither(Right<Tuple<number, number>, Error>(tuple)),
  map(reduce((prev, curr) => prev + curr, 0))
)

const sla = pipe(
  Right(0),
  chain(() => Right(''))
)
const sla2 = pipe(
  Right(2),
  ap(Right((num) => num * 2)),
  ap(Right((num) => num * 10))
)

const nonEmptyListOf = <T>(o: T) => [o] as NonEmptyList<T>

const seqtest = pipe(
  [Right(0)] as NonEmptyList<Either<never, number>>,
  sequence(Either.of)
)

const seqtest2 = pipe(
  [Just(0)] as NonEmptyList<Maybe<number>>,
  sequence(Maybe.of)
)
