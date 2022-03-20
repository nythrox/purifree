import { Tuple } from './Tuple'
import { Maybe, Just, Nothing } from './Maybe'
import { ApKind } from './pointfree/ap'
import { ReplaceFirst, Type, URIS } from './pointfree/hkt'
import { NonEmptyArray, ofAp } from '.'
import { Order, orderToNumber } from "purify-ts"

/** Returns Just the first element of an array or Nothing if there is none. If you don't want to work with a Maybe but still keep type safety, check out `List` */
const head = <T>(list: T[]): Maybe<T> =>
  list.length > 0 ? Just(list[0]) : Nothing

/** Returns Just the last element of an array or Nothing if there is none */
const last = <T>(list: T[]): Maybe<T> =>
  list.length > 0 ? Just(list[list.length - 1]) : Nothing

/** Returns all elements of an array except the first */
const tail = <T>(list: T[]): Maybe<T[]> =>
  list.length > 0 ? Just(list.slice(1)) : Nothing

/** Returns all elements of an array except the last */
const init = <T>(list: T[]): Maybe<T[]> =>
  list.length > 0 ? Just(list.slice(0, -1)) : Nothing

/** Returns a tuple of an array's head and tail */
const uncons = <T>(list: T[]): Maybe<Tuple<T, T[]>> =>
  list.length > 0 ? Just(Tuple(list[0], list.slice(1))) : Nothing

/* Returns the sum of all numbers inside an array */
const sum = (list: number[]): number => list.reduce((acc, x) => acc + x, 0)

/** Returns the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.find */
function find<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list: T[]
): Maybe<T>
function find<T>(
  f: (x: T, index: number, arr: T[]) => boolean
): (list: T[]) => Maybe<T>
function find<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list?: T[]
): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => find(f, list)
    default:
      return Maybe.fromNullable(list!.find(f))
  }
}

/** Returns the index of the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.findIndex */
function findIndex<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list: T[]
): Maybe<number>
function findIndex<T>(
  f: (x: T, index: number, arr: T[]) => boolean
): (list: T[]) => Maybe<number>
function findIndex<T>(
  f: (x: T, index: number, arr: T[]) => boolean,
  list?: T[]
): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => findIndex(f, list)
    default:
      return Maybe.fromPredicate((x) => x !== -1, list!.findIndex(f))
  }
}

/** Returns the element at a given index of a list */
function at<T>(index: number, list: T[]): Maybe<T>
function at<T>(index: number): (list: T[]) => Maybe<T>
function at<T>(index: number, list?: T[]): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => at(index, list)
    default:
      return list![index] === undefined ? Nothing : Just(list![index])
  }
}

/** Sorts an array with the given comparison function */
function sort<T>(compare: (a: T, b: T) => Order, list: T[]): T[]
function sort<T>(compare: (a: T, b: T) => Order): (list: T[]) => T[]
function sort<T>(compare: (a: T, b: T) => Order, list?: T[]): any {
  switch (arguments.length) {
    case 1:
      return (list: T[]) => sort(compare, list)
    default:
      return [...list!].sort((x, y) => orderToNumber(compare(x, y)))
  }
}

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
      (List() as any) as List<T2>
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
  init,
  uncons,
  at,
  head,
  last,
  tail,
  find,
  findIndex,
  sum,
  sort
})