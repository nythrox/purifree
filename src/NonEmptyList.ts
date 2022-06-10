import { NonEmptyList } from 'purify-ts/NonEmptyList'
import { ListImpl } from './List'
import { ApKind, ofAp } from './pointfree/ap'
import { ReplaceFirst, Type, URIS } from './pointfree/hkt'
export type NonEmptyArray<T> = T[] & { 0: T }

declare module 'purify-ts/NonEmptyList' {
  interface NonEmptyList<T> {
    readonly _URI: NON_EMPTY_LIST_URI
    readonly _A: [T]

    traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
      of: ofAp<URI>,
      f: (a: T) => AP
    ): Type<URI, ReplaceFirst<AP['_A'], NonEmptyList<AP['_A'][0]>>>

    sequence<Ap extends ApKind<any, any>>(
      this: NonEmptyList<Ap>,
      of: ofAp<Ap['_URI']>
    ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], NonEmptyList<Ap['_A'][0]>>>

    chain<U>(
      this: NonEmptyList<T>,
      callbackfn: (
        value: T,
        index: number,
        array: NonEmptyList<T>
      ) => NonEmptyList<U>,
      thisArg?: any
    ): NonEmptyList<U>

    reverse(this: NonEmptyList<T>): NonEmptyList<T>

    ap<R2>(other: NonEmptyList<(value: T) => R2>): NonEmptyList<R2>

    joinM<T2>(this: NonEmptyList<NonEmptyList<T2>>): NonEmptyList<T2>
    'fantasy-land/traverse': this['traverse']
    'fantasy-land/sequence': this['sequence']
    'fantasy-land/map': this['map']
    'fantasy-land/chain': this['chain']
    'fantasy-land/ap': this['ap']
  }
  interface NonEmptyListTypeRef {
    of<T>(val: T): NonEmptyList<T>
  }
}

export const concat =
  <T>(arr: Array<T>) =>
  (arr2: Array<T>) =>
    arr.concat(arr2)
export const NON_EMPTY_LIST_URI = 'NonEmptyList'
export type NON_EMPTY_LIST_URI = typeof NON_EMPTY_LIST_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [NON_EMPTY_LIST_URI]: NonEmptyList<Types[0]>
  }
}

NonEmptyList.of = <T>(val: T) => new ListImpl(val) as unknown as NonEmptyList<T>

export * from 'purify-ts/NonEmptyList'
