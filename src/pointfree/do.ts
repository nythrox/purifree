import { Just, Left, Right } from '..'
import { EitherAsync } from '../EitherAsync'
import { chain, Chainable } from './chain'
import { flow, pipe } from './function-utils'
import { HKT, of, ReplaceFirst, Type, URIS } from './hkt_tst'
import { map } from './map'
export const ofSymbol = Symbol('of')
export interface GeneratableKind<F extends URIS, A extends any[]>
  extends Chainable<F, A> {
  [Symbol.iterator]: () => Iterator<Type<F, A>, A[0], any>
  [ofSymbol]: of<F>
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
  _fun: IsUnion<URI> extends false
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
  fun: MultipleMonadsError extends true
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
  const iterator = (fun as () => Generator<Generatable, R, any>)()
  const state = iterator.next()
  const of = (state.value as Generatable)[ofSymbol]
  function run(state: IteratorResult<Generatable, R>): any {
    // console.log('received state: ',state.value)
    if (state.done) {
      return of(state.value)
    }
    return state.value.chain((val) => {
      // console.log('inside chain: ',val)
      return run(iterator.next(val))
    })
  }
  return run(state)
}

// type smh = [number, never] extends any ? true : false
// type test4 = AssertEqual<
//   EitherAsync<never, number>,
//   GeneratableKind<'EitherAsync', any>
// >
// type test2 = AssertEqual<
//   EitherAsync<never, number>,
//   Chainable<'EitherAsync', any>
// >
// type test3 = AssertEqual<EitherAsync<never, number>, EitherAsync<any, any>>
// type smhz<T extends Chainable<'EitherAsync', any>> = T

// type why = smhz<EitherAsync<never, string>>
// type h = Chainable<'EitherAsync', [never, string]>['chain']
// type v = Chainable<'EitherAsync', [number, never]>
// type v2 = EitherAsync<number, never>
// type test = EitherAsync<never, number>['_A'] extends any ? true : false

// result :: Either<Error, { name: string, surname: string, favoriteColor: string }>
// const result = Do(function* () {
//   // name :: string
//   const name = yield* Right('Jason')
//   // surname :: string
//   const surname = yield* Right('Santiago')
//   // favoriteColor :: string
//   const favoriteColor = yield* Left<Error, string>(Error('DB error!'))
//   return {
//     name,
//     surname,
//     favoriteColor
//   }
// })

// // result :: Either<Error, { name: string, surname: string, favoriteColor: string }>
// const result1 = Right<string, Error>('jason').chain((name) =>
//   Right<string, Error>('Santiago').chain((surname) =>
//     Left<Error, string>(Error('DB error!')).map((favoriteColor) => ({
//       name,
//       surname,
//       favoriteColor
//     }))
//   )
// )

// const result2 = pipe(
//   Right<string, Error>('Jason'),
//   chain((name) =>
//     pipe(
//       Right<string, Error>('Santiago'),
//       chain((surname) =>
//         pipe(
//           Left<Error, string>(Error('DB error!')),
//           map((favoriteColor) => ({
//             name: name,
//             surname,
//             favoriteColor
//           }))
//         )
//       )
//     )
//   )
// )
// const resultFlex = DoFlex(function* () {
//   const h = yield* Right(10)
//   const w = yield* Left(Error())
//   const zw = yield* Right('hi')
//   const w0 = yield* Left('sstring')
//   return 'jasno' + zw
// })
