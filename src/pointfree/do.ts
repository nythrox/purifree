import { Just, Left, Right } from '..'
import { EitherAsync } from '../EitherAsync'
import { Chainable } from './chain'
import { AssertEqual, HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface GeneratableKind<F extends URIS, A extends any[]>
  extends Chainable<F, A> {
  [Symbol.iterator]: () => Iterator<Type<F, A>, A[0], any>
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type IsUnion<Key> =
  // If this is a simple type UnionToIntersection<Key> will be the same type, otherwise it will an intersection of all types in the union and probably will not extend `Key`
  [Key] extends [UnionToIntersection<Key>] ? false : true

// TODO: Do and DoFlex
export function DoFlex<
  Generatable extends GeneratableKind<any, any>,
  URI extends URIS = Generatable['_URI'],
  R = any
>(
  fun: IsUnion<URI> extends false
    ? () => Generator<Generatable, R, any>
    : [
        'ERROR: Cannot have monads of different types in do* notation. Different monads found: ',
        URI
      ]
): Type<URI, ReplaceFirst<Generatable['_A'], R>> {
  return null as any
}

export function Do<
  R,
  T extends any[],
  Generatable extends GeneratableKind<any, [any, ...T]>,
  URI extends URIS = Generatable['_URI'],
  Rest = Generatable['_A'] extends [infer _A, ...infer Rest] ? Rest : never,
  SecondaryGenericsError = IsUnion<Rest> extends true ? true : false,
  MultipleMonadsError = IsUnion<URI> extends true ? true : false
>(
  _fun: MultipleMonadsError extends true
    ? [
        'ERROR: Cannot have monads of different types in do* notation. Different monads found:',
        URI
      ]
    : SecondaryGenericsError extends true
    ? [
        'ERROR: All secondary generics must be of the same type. Different generics found: ',
        Rest
      ]
    : () => Generator<Generatable, R, any>
): Type<URI, ReplaceFirst<Generatable['_A'], R>> {
  return null as any
}

type smh = [number, never] extends any ? true : false
type test4 = AssertEqual<
  EitherAsync<never, number>,
  GeneratableKind<'EitherAsync', any>
>
type test2 = AssertEqual<
  EitherAsync<never, number>,
  Chainable<'EitherAsync', any>
>
type test3 = AssertEqual<EitherAsync<never, number>, EitherAsync<any, any>>
type smhz<T extends Chainable<'EitherAsync', any>> = T

type why = smhz<EitherAsync<never, string>>
type h = Chainable<'EitherAsync', [never, string]>['chain']
type v = Chainable<'EitherAsync', [number, never]>
type v2 = EitherAsync<number, never>
type test = EitherAsync<never, number>['_A'] extends any ? true : false

const result = Do(function* () {
  const h = yield* Right(10)
  const w = yield* Left(Error())
  // yield* Just(Error())
  const zw = yield* Right('hi')
  return 'jasno' + zw
})

const resultFlex = DoFlex(function* () {
  const h = yield* Right(10)
  const w = yield* Left(Error())
  const zw = yield* Right('hi')
  const w0 = yield* Left('sstring')
  return 'jasno' + zw
})

const restura = Do(function* () {
  const user = yield* EitherAsync.liftEither(
    Right<{ name: string }, Error>({
      name: 'jason'
    })
  )
  // if (user.name != 'jason') {
  //   yield* EitherAsync.liftEither(Left('Not cool bro !'))
  // }
  // if (user.name.length < 3) {
  //   yield* EitherAsync.liftEither(
  //     Left({
  //       error: 'erro !!!'
  //     })
  //   )
  // }
  return user.name
})
