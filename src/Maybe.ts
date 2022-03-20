import { ApKind, ofAp } from './pointfree/ap'
import { ofSymbol } from './pointfree/do'
import { ReplaceFirst, Type, URIS } from './pointfree/hkt'
import { Maybe, Just, Nothing } from 'purify-ts/Maybe'

declare module 'purify-ts/Maybe' {
  interface Maybe<T> {
    readonly _URI: MAYBE_URI
    readonly _A: [T]

    [ofSymbol]: typeof Maybe.of
    [Symbol.iterator]: () => Iterator<Type<MAYBE_URI, [T]>, T, any>

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      of: ofAp<URI>,
      f: (a: T) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: Maybe<Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>>

    'fantasy-land/traverse': this['traverse']
    'fantasy-land/sequence': this['sequence']
  }
  interface Just<T> {
    readonly _URI: MAYBE_URI
    readonly _A: [T]

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      _of: ofAp<URI>,
      f: (a: T) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>>

    'fantasy-land/traverse'<
      URI extends URIS,
      AP extends ApKind<any, any> = ApKind<URI, any>
    >(
      of: ofAp<URI>,
      f: (a: T) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>>

    'fantasy-land/sequence'<Ap extends ApKind<any, any>>(
      this: Maybe<Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: Maybe<Ap>,
      _of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>>
  }
  interface Nothing {
    readonly _URI: MAYBE_URI
    readonly _A: [never]

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      of: ofAp<URI>,
      _f: (a: never) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>>

    'fantasy-land/traverse'<
      URI extends URIS,
      AP extends ApKind<any, any> = ApKind<URI, any>
    >(
      of: ofAp<URI>,
      f: (a: never) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>>

    'fantasy-land/sequence'<Ap extends ApKind<any, any>>(
      this: Maybe<Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: Maybe<Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>>
  }
}

export const MAYBE_URI = 'Maybe'

export type MAYBE_URI = typeof MAYBE_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [MAYBE_URI]: Maybe<Types[0]>
  }
}

type T = any

Just.prototype[Symbol.iterator] = function* (): ThisType<any> {
  return (yield this) as T
}
Just.prototype[ofSymbol] = Maybe.of

Just.prototype.traverse = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  _of: ofAp<URI>,
  f: (a: T) => AP
): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>> {
  const result = f(this.__value)
  return result.map(Just)
}

Just.prototype['fantasy-land/traverse'] = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  of: ofAp<URI>,
  f: (a: T) => AP
): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>> {
  return this.traverse(of, f)
}
Just.prototype['fantasy-land/sequence'] = function <
  Ap extends ApKind<any, any>
>(
  this: Maybe<Ap>,
  of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>> {
  return this.sequence(of)
}
Just.prototype.sequence = function <Ap extends ApKind<any, any>>(
  this: Maybe<Ap>,
  _of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>> {
  return (this as any).__value.map(Just)
}

Nothing.constructor.prototype[Symbol.iterator] = function* (): ThisType<never> {
  return (yield this) as never
}

Nothing.constructor.prototype[ofSymbol] = Maybe.of

Nothing.constructor.prototype.traverse = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  of: ofAp<URI>,
  _f: (a: never) => AP
): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>> {
  return of(this) as any
}
Nothing.constructor.prototype['fantasy-land/traverse'] = function <
  URI extends URIS,
  AP extends ApKind<any, any> = ApKind<URI, any>
>(
  of: ofAp<URI>,
  f: (a: never) => AP
): Type<URI, ReplaceFirst<AP['_A'], Maybe<AP['_A'][0]>>> {
  return this.traverse(of, f)
}
Nothing.constructor.prototype['fantasy-land/sequence'] = function <
  Ap extends ApKind<any, any>
>(
  this: Maybe<Ap>,
  of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>> {
  return this.sequence(of)
}

Nothing.constructor.prototype.sequence = function <Ap extends ApKind<any, any>>(
  this: Maybe<Ap>,
  of: ofAp<Ap['_URI']>
): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Maybe<Ap['_A'][0]>>> {
  return of(this) as any
}

export * from 'purify-ts/Maybe'
