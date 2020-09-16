import { Either, Left, Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { Just, Maybe } from '../Maybe'
import { Tuple } from '../Tuple'
import { flow, pipe } from './function-utils'
import { caseOf } from './map'

export interface HKT<F, A extends any[]> {
  _URI: F
  _A: A
}
export type URIS = keyof URI2HKT<any>
type ReplaceFirst<Arr extends any[], T> = Arr extends [
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

interface FunctorKind<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly map: <B>(f: (a: A[0]) => B) => Type<F, ReplaceFirst<A, B>>
}
interface MonadKind<F extends URIS, A extends any[]> extends FunctorKind<F, A> {
  readonly chain: <B>(
    f: (a: A[0]) => Type<F, [B]>
  ) => Type<F, ReplaceFirst<A, B>>
}
interface GeneratableKind<F extends URIS, A extends any[]>
  extends MonadKind<F, A> {
  [Symbol.iterator]: () => Iterator<Type<F, [A]>, A, A>
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

function Do<URI extends URIS, R = any>(
  fun: () => Generator<GeneratableKind<URI, any>, R, any>
): Type<URI, [R]> {
  return null as any
}

const v = Do(function* () {
  const h = yield* Just(0)
  return 'jasno'
})

const pointfreeForAll = pipe(
  // Either
  Right(0),
  map((num) => num * 2),
  caseOf({
    Right: () => Just(5),
    Left: () => Just(5)
  }),
  // Just
  map((num) => num * 2),
  caseOf({
    Just: () => Tuple(1, 2),
    Nothing: () => Tuple(1, 2)
  }),
  // Tuple
  map((scnd) => scnd * 2),
  // EitherAsync
  (tuple) => EitherAsync.liftEither(Right(tuple)),
  map(flow(reduce((prev, curr) => prev + curr, 0)))
)
