import { Any, U } from 'ts-toolbelt'
import { Right } from '../Either'
import { Just } from '../Maybe'
import { pipe } from '../utils'
import { chain, Chainable, chainFlex } from './chain'
import { filter } from './filter'
import { of, ReplaceFirst, Type, URIS } from './hkt'
import { map } from './map'
export const ofSymbol = Symbol('of')
export interface GeneratableKind<F extends URIS, A extends any[]>
  extends Chainable<F, A> {
  [Symbol.iterator]: () => Iterator<Type<F, A>, A[0], any>
  [ofSymbol]: of<F>
}

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type IsUnion<Key> =
  // If this is a simple type UnionToIntersection<Key> will be the same type, otherwise it will an intersection of all types in the union and probably will not extend `Key`
  [Key] extends [UnionToIntersection<Key>] ? false : true

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
  Generatable extends GeneratableKind<any, any>,
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
): MultipleMonadsError extends true
  ? true
  : Type<URI, ReplaceFirst<Generatable['_A'], R>> {
  const iterator = (fun as () => Generator<Generatable, R, any>)()
  const state = iterator.next()
  const of = (state.value as Generatable)[ofSymbol]
  function run(state: IteratorResult<Generatable, R>): any {
    if (state.done) {
      return of(state.value)
    }
    return state.value.chain((val) => {
      return run(iterator.next(val))
    })
  }
  return run(state)
}

// export function Do2<R, URI extends URIS, A extends any[]>(
//   fun: () => Generator<GeneratableKind<URI, A>, R, any>
// ): IsUnion<A> extends true
//   ? { error: 'All secondary generics must be of the same type.' }
//   : IsUnion<URI> extends true
//   ? {
//       error: 'Cannot have monads of different types in do* notation'
//     }
//   : Type<URI, ReplaceFirst<A, R>> {
//   return 0 as any
// }