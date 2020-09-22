import { validate } from 'json-schema'
import { List, Nothing } from '..'
import { Either, Left, Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { Just, Maybe } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { NonEmptyList } from '../NonEmptyList'
import { Tuple } from '../Tuple'
import { ap, ApKind } from './ap'
import { bimap } from './bimap'
import { match } from './caseOf'
import { chain, Chainable, chainFlex, MonadKind } from './chain'
import { filter } from './filter'
import { flow, identity, pipe } from './function-utils'
import { join } from './join'
import { FunctorKind, map } from './map'
import { mapLeft } from './mapLeft'
import { reduce } from './reduce'
import { sequence } from './sequence'
import { swap } from './swap'
import { toMaybe } from './toMaybe'
import { A, L } from 'ts-toolbelt'
// import { match } from './map_old'
export type URIS = keyof URI2HKT<any>
export interface HKT<F extends URIS, A extends any[]> {
  _URI: F
  _A: A
}
export type TypeFromHKT<
  other extends HKT<any, any>,
  replaceA extends any[]
> = Type<other['_URI'], Replace<other['_A'], replaceA>>

export type HKTFrom<
  other extends HKT<any, any>,
  A extends any[],
  uri extends URIS = other['_URI'],
  oldA extends any[] = other['_A']
> = HKT<uri, Replace<oldA, A>>

export type Replace<oldA extends any[], newA extends any[]> = [
  ...newA,
  ...L.Drop<oldA, L.Length<newA, 's'>, '->'>
]

export type ReplaceFirst<Arr extends any[], T extends any> = Arr extends [
  infer _Head,
  ...infer Rest
]
  ? // ? [T, ...Rest]
    // : Arr

    [T, ...Rest]
  : [T, ...any]

export type ReplaceSecond<Arr extends any[], T> = Arr extends [
  infer Head,
  infer _Second,
  ...infer Rest
]
  ? [Head, T, ...Rest]
  : // : Arr
  Arr extends [infer Head]
  ? [Head, T]
  : [undefined, T]

export type SumSecondArg<Arr extends any[], T> = Arr extends [
  infer Head,
  infer Second,
  ...infer Rest
]
  ? [Head, T | Second, ...Rest]
  : // : Arr
  Arr extends [infer Head]
  ? [Head, T]
  : [undefined, T]
export type ReplaceFirstAndSecond<Arr extends any[], A, B> = Arr extends [
  infer _First,
  infer _Second,
  ...infer Rest
]
  ? [A, B, ...Rest]
  : // : Arr
    [A, B]

export type OrNever<K> = unknown extends K ? never : K

export type ReplaceFirstAndReplaceSecondIfSecondIsNever<
  Arr extends any[],
  A,
  B
> = Arr extends [infer _First, infer Second, ...infer Rest]
  ? [A, OrNever<Second> extends never ? B : Second, ...Rest]
  : // : Arr
    [A, B]

export type SwapFirstTwo<Arr extends any[]> = Arr extends [
  infer First,
  infer Second,
  ...infer Rest
]
  ? [Second, First, ...Rest]
  : // : Arr
  Arr extends [infer First]
  ? [undefined, First]
  : []

export type Type<URI extends URIS, A extends any[]> = URI2HKT<A>[URI]
// Types are sorted by order of priority, not of placement (type #1 is mapped, type #1 is mapLeft, etc)
export interface URI2HKT<Types extends any[]> {}

export type of<URI extends URIS> = <T>(value: T) => HKT<URI, [T, ...any]>

export type AssertEqual<A, B, R = A extends B ? true : false> = R
type test1 = AssertEqual<Either<any, any>, HKT<any, any>>
type test2 = AssertEqual<HKT<any, any>, Either<any, any>>
type test3 = AssertEqual<Type<'Either', any>, Either<any, any>>

type sla = [number, never] extends any[] ? true : false

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
  (tuple) => EitherAsync.liftEither(Right(tuple)),
  map(reduce((prev, curr) => prev + curr, 0))
)

pointfreeForAll

const createValidator = <A, L, R>(
  validator: (value: A) => Either<L, R>,
  ...validators: ((value: A) => Either<L, R>)[]
) => (arg: A) => {
  const results = [validator, ...validators].map((validator) =>
    validator(arg).swap()
  ) as NonEmptyList<Either<R, L>>
  return pipe(results, sequence(Either.of), swap())
}
const createAsyncValidator = <A, L, R>(
  validator: (value: A) => EitherAsync<L, R>,
  ...validators: ((value: A) => EitherAsync<L, R>)[]
) => (arg: A) => {
  const results = [validator, ...validators].map((validator) =>
    validator(arg).swap()
  ) as NonEmptyList<EitherAsync<R, L>>
  return pipe(results, sequence(EitherAsync.of), swap())
}

const minLength = (s: string): Either<Error, string> =>
  s.length >= 6 ? Right(s) : Left(Error('at least 6 characters'))

const oneCapital = (s: string): Either<Error, string> =>
  /[A-Z]/g.test(s) ? Right(s) : Left(Error('at least one capital letter'))

const oneNumber = (s: string): Either<Error, string> =>
  /[0-9]/g.test(s) ? Right(s) : Left(Error('at least one number'))

const validatePassword = createValidator(minLength, oneCapital, oneNumber)

const test = pipe(
  Right('jason'),
  chainFlex(validatePassword),
  toMaybe(),
  filter((password) => password.length > 5)
)

const list = pipe(
  List(1, 2, 3, 4, 5),
  chain((num) => List(num * 2)),
  reduce((a, b) => a + b, 0)
)
