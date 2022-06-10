import { List as listMethods } from 'purify-ts'
import { ApKind } from './pointfree/ap'
import { ReplaceFirst, Type, URIS } from './pointfree/hkt'
import { NonEmptyArray, ofAp } from '.'

export const LIST_URI = 'List'
export type LIST_URI = typeof LIST_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [LIST_URI]: List<Types[0]>
  }
}
export interface List<T> extends Array<T> {
  readonly _URI: LIST_URI
  readonly _A: [T]
  sequence<Ap extends ApKind<any, any>>(
    this: List<Ap>,
    of: ofAp<Ap['_URI']>
  ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], List<Ap['_A'][0]>>>

  traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
    of: ofAp<URI>,
    f: (a: T) => AP
  ): Type<URI, ReplaceFirst<AP['_A'], List<AP['_A'][0]>>>

  map<U>(
    this: List<T>,
    callbackfn: (value: T, index: number, array: List<T>) => U,
    thisArg?: any
  ): List<U>

  ap<R2>(other: List<(value: T) => R2>): List<R2>

  chain<U>(
    this: List<T>,
    callbackfn: (value: T, index: number, array: List<T>) => List<U>,
    thisArg?: any
  ): List<U>
  reverse(this: List<T>): List<T>

  joinM<T2>(this: List<List<T2>>): List<T2>

  'fantasy-land/traverse': this['traverse']
  'fantasy-land/sequence': this['sequence']
  'fantasy-land/map': this['map']
  'fantasy-land/chain': this['chain']
  'fantasy-land/ap': this['ap']
}
export class ListImpl<T> extends Array<T> implements List<T> {
  readonly _URI!: LIST_URI
  readonly _A!: [T]

  constructor(...items: T[]) {
    super(...items)
    Object.setPrototypeOf(this, ListImpl.prototype)
  }

  ap<R2>(other: List<(value: T) => R2>): List<R2> {
    return other.chain((f) => this.map(f) as any)
  }

  'fantasy-land/ap'<R2>(other: List<(value: T) => R2>): List<R2> {
    return this.ap(other)
  }

  'fantasy-land/traverse'<
    URI extends URIS,
    AP extends ApKind<any, any> = ApKind<URI, any>
  >(
    of: ofAp<URI>,
    f: (a: T) => AP
  ): Type<URI, ReplaceFirst<AP['_A'], List<AP['_A'][0]>>> {
    return this.traverse(of, f)
  }

  traverse<URI extends URIS, AP extends ApKind<any, any> = ApKind<URI, any>>(
    of: ofAp<URI>,
    f: (a: T) => AP
  ): Type<URI, ReplaceFirst<AP['_A'], List<AP['_A'][0]>>> {
    const initialState = of(List() as List<AP['_A'][0]>)
    return this.reduceRight((tail, head) => {
      const v0 = f(head).map((val) => (tail: any[]) => [val, ...tail])
      return tail.ap(v0) as any
    }, initialState) as any
  }

  'fantasy-land/sequence'<Ap extends ApKind<any, any>>(
    this: List<Ap>,
    of: ofAp<Ap['_URI']>
  ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], List<Ap['_A'][0]>>> {
    return this.sequence(of)
  }
  sequence<Ap extends ApKind<any, any>>(
    this: List<Ap>,
    of: ofAp<Ap['_URI']>
  ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], List<Ap['_A'][0]>>> {
    return this.traverse(of, (e) => e)
  }

  'fantasy-land/map'<U>(
    this: List<T>,
    callbackfn: (value: T, index: number, array: List<T>) => U,
    thisArg?: any
  ): List<U> {
    return this.map(callbackfn, thisArg)
  }

  map!: <U>(
    this: List<T>,
    callbackfn: (value: T, index: number, array: List<T>) => U,
    thisArg?: any
  ) => List<U>

  'fantasy-land/chain'<U>(
    this: List<T>,
    callbackfn: (value: T, index: number, array: List<T>) => List<U>,
    thisArg?: any
  ): List<U> {
    return this.chain(callbackfn, thisArg)
  }
  chain<U>(
    this: List<T>,
    callbackfn: (value: T, index: number, array: List<T>) => List<U>,
    thisArg?: any
  ): List<U> {
    return this.map(callbackfn, thisArg).joinM()
  }
  joinM<T2>(this: List<List<T2>>): List<T2> {
    return this.reduce(
      (acc, val) => acc.concat(val) as List<T2>,
      List() as any as List<T2>
    )
  }
  reverse!: (this: List<T>) => List<T>
}

function ListConstructor<T>(list: NonEmptyArray<T>): List<T> & { 0: T }
function ListConstructor<T>(list: T[]): List<T>
function ListConstructor<T, Rest extends T[]>(
  value1: T,
  ...values: Rest
): List<T> & { 0: T }
function ListConstructor<T extends any[]>(...values: T): List<T[number]>
function ListConstructor(...args: any[]) {
  if (args.length === 1 && Array.isArray(args[0])) {
    return ListImpl.from(args[0])
  }
  return ListImpl.of(...args)
}
export const List = Object.assign(ListConstructor, {
  of: <T>(val: T) => ListImpl.of(val) as List<T> & { 0: T },
  ...listMethods
})
