import { ApKind, ofAp } from './pointfree/ap'
import { ofSymbol } from './pointfree/do'
import { HKT, ReplaceFirst, Type, URIS } from './pointfree/hkt'
import { Just, Maybe, Nothing as nothing } from 'purify-ts/Maybe'

export const MAYBE_URI = 'Maybe'

export type MAYBE_URI = typeof MAYBE_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [MAYBE_URI]: Maybe<Types[0]>
  }
}

declare module 'purify-ts' {
  interface Maybe<T> extends HKT<MAYBE_URI, [T]> {
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
}

// God, I'm so sorry
const _just = Object.getPrototypeOf(Just(undefined))
const _nothingPrototype = Object.getPrototypeOf(nothing)

_just[Symbol.iterator] = function* (): ThisType<any> {
  return yield this
}

_just[ofSymbol] = Maybe.of

_just.traverse = function (_of: any, f: any): any {
  const result = f(this.__value)
  return result.map(Just)
}

_just['fantasy-land/traverse'] = function (of: any, f: any): any {
  return this.traverse(of, f)
}

_just['fantasy-land/sequence'] = function (of: any): any {
  return this.sequence(of)
}

_just.sequence = function (_of: any): any {
  return this.__value.map(Just)
}

_nothingPrototype[Symbol.iterator] = function* (): ThisType<never> {
  return (yield this) as never
}

_nothingPrototype[ofSymbol] = Maybe.of

_nothingPrototype.traverse = function (of: any, _f: any): any {
  return of(this) as any
}

_nothingPrototype['fantasy-land/traverse'] = function (of: any, f: any) {
  return this.traverse(of, f)
}

_nothingPrototype['fantasy-land/sequence'] = function (of: any): any {
  return this.sequence(of)
}

_nothingPrototype.sequence = function (of: any): any {
  return of(this) as any
}

type N = typeof nothing & Maybe<never>

interface Nothing extends N {
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

export * from 'purify-ts/Maybe'
export const Nothing: Nothing = nothing as any
