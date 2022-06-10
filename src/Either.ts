import { ApKind, ofAp } from './pointfree/ap'
import { ofSymbol } from './pointfree/do'
import { HKT, ReplaceFirst, Type, URIS } from './pointfree/hkt'

import { Right, Either, Left } from 'purify-ts/Either'

export const EITHER_URI = 'Either'

export type EITHER_URI = typeof EITHER_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [EITHER_URI]: Either<Types[1], Types[0]>
  }
}

declare module 'purify-ts/Either' {
  interface Either<L, R> extends HKT<EITHER_URI, [R, L]> {
    readonly _URI: EITHER_URI
    readonly _A: [R, L]

    [Symbol.iterator]: () => Iterator<Either<L, R>, R, any>

    [ofSymbol]: typeof Either['of']

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      of: ofAp<URI>,
      f: (a: R) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: Either<L, Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>>

    'fantasy-land/traverse'<
      URI extends URIS,
      AP extends ApKind<any, any> = ApKind<URI, any>
    >(
      of: ofAp<URI>,
      f: (a: R) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>>

    'fantasy-land/sequence'<Ap extends ApKind<any, any>>(
      this: Either<L, Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>>
  }
}

// God, I'm so sorry
const _right = Object.getPrototypeOf(Right(undefined))
const _left = Object.getPrototypeOf(Left(undefined))

_right[ofSymbol] = Either.of
_right[Symbol.iterator] = function* (): ThisType<any> {
  return yield this
}
_right['fantasy-land/traverse'] = function (of: any, f: (a: any) => any): any {
  return this.traverse(of, f)
}

_right.traverse = function (_of: any, f: any): any {
  const result = f(this.__value)
  return result.map(Right)
}

_right['fantasy-land/sequence'] = function (of: any): any {
  return this.sequence(of)
}

_right.sequence = function (_of: any): any {
  return this.__value.map(Right)
}

_left[ofSymbol] = Either.of

_left[Symbol.iterator] = function* (): ThisType<any> {
  return yield this
}

_left['fantasy-land/traverse'] = function (f: any): any {
  return this.traverse(f)
}

_left.traverse = function (of: any, _f: any): any {
  return of(this) as any
}

_left['fantasy-land/sequence'] = function (of: any): any {
  return this.sequence(of)
}

_left.sequence = function (of: any): any {
  return of(this)
}

export type IsLeft = {
  <L, R>(either: Either<L, R>): either is Either<L, never>
}

export type IsRight = {
  <L, R>(either: Either<L, R>): either is Either<never, R>
}
export const isLeft: IsLeft = <L, R>(
  either: Either<L, R>
): either is Either<L, never> => either.isLeft()
export const isRight: IsRight = <L, R>(
  either: Either<L, R>
): either is Either<never, R> => either.isRight()

export { Right, Either, Left } from 'purify-ts/Either'
export type { EitherPatterns } from 'purify-ts/Either'
