import { ApKind, ofAp } from './pointfree/ap'
import { ofSymbol } from './pointfree/do'
import { ReplaceFirst, Type, URIS } from './pointfree/hkt'

import { Right, Either, Left } from 'purify-ts/Either'
declare module 'purify-ts/Either' {
  interface Either<L, R> {
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
  interface Right<R, L = never> {
    readonly _URI: EITHER_URI

    readonly _A: [R, L]

    [ofSymbol]: typeof Either.of

    'fantasy-land/traverse'<
      URI extends URIS,
      AP extends ApKind<any, any> = ApKind<URI, any>
    >(
      of: ofAp<URI>,
      f: (a: R) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>>

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      _of: ofAp<URI>,
      f: (a: R) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>>

    'fantasy-land/sequence'<Ap extends ApKind<any, any>>(
      this: Either<L, Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: Either<L, Ap>,
      _of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>>
  }
  interface Left<L, R = never> {
    readonly _URI: EITHER_URI
    readonly _A: [R, L]

    [ofSymbol]: typeof Either.of

    'fantasy-land/traverse'<
      URI extends URIS,
      AP extends ApKind<any, any> = ApKind<URI, any>
    >(
      of: ofAp<URI>,
      f: (a: R) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>>

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      of: ofAp<URI>,
      _f: (a: R) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>>

    'fantasy-land/sequence'<Ap extends ApKind<any, any>>(
      this: Either<L, Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: Either<L, Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>>
  }
}

type L = any
type R = any
type Ap = any

Right.prototype[ofSymbol] = Either.of
Right.prototype[Symbol.iterator] = function* (): ThisType<any> {
  return yield this
}
Right.prototype['fantasy-land/traverse'] = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  of: ofAp<URI>,
  f: (a: R) => AP
): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>> {
  return this.traverse(of, f)
}

Right.prototype.traverse = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  _of: ofAp<URI>,
  f: (a: R) => AP
): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>> {
  const result = f(this.__value)
  return result.map(Right)
}

Right.prototype['fantasy-land/sequence'] = function (
  this: Either<L, Ap>,
  of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>> {
  return this.sequence(of)
}

Right.prototype.sequence = function <Ap extends ApKind<any, any>>(
  this: Either<L, Ap>,
  _of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>> {
  return (this as any).__value.map(Right)
}

export const EITHER_URI = 'Either'

export type EITHER_URI = typeof EITHER_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [EITHER_URI]: Either<Types[1], Types[0]>
  }
}

Left.prototype[ofSymbol] = Either.of

Left.prototype[Symbol.iterator] = function* (): ThisType<any> {
  return yield this
}

Left.prototype['fantasy-land/traverse'] = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  of: ofAp<URI>,
  f: (a: R) => AP
): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>> {
  return this.traverse(of, f)
}

Left.prototype.traverse = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  of: ofAp<URI>,
  _f: (a: R) => AP
): Type<URI, ReplaceFirst<AP['_A'], Either<L, AP['_A'][0]>>> {
  return of(this) as any
}

Left.prototype['fantasy-land/sequence'] = function <
  Ap extends ApKind<any, any>
>(
  this: Either<L, Ap>,
  of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>> {
  return this.sequence(of)
}

Left.prototype.sequence = function <Ap extends ApKind<any, any>>(
  this: Either<L, Ap>,
  of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Either<L, Ap['_A'][0]>>> {
  return of(this)
}

// const right = <R, L = never>(value: R): Either<L, R> => Right(value)

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

export * from 'purify-ts/Either'
