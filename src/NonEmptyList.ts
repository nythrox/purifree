import { Either, Right } from './Either'
import { Maybe, Just, Nothing } from './Maybe'
import { ApKind } from './pointfree/ap'
import { of, HKT, ReplaceFirst, Type, URIS } from './pointfree/hkt_tst'
import { SequenceableKind } from './pointfree/sequence'
import { Tuple } from './Tuple'
export type NonEmptyListCompliant<T> = T[] & { 0: T }

export interface NonEmptyList<T> extends NonEmptyListCompliant<T> {
  readonly _URI: NON_EMPTY_LIST_URI
  readonly _A: [T]
  sequence<Ap extends ApKind<any, any>>(
    this: NonEmptyList<Ap>,
    of: of<Ap['_URI']>
  ): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], NonEmptyList<Ap['_A'][0]>>>
  map<U>(
    this: NonEmptyList<T>,
    callbackfn: (value: T, index: number, array: NonEmptyList<T>) => U,
    thisArg?: any
  ): NonEmptyList<U>
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

  joinM<T2>(this: NonEmptyList<NonEmptyList<T2>>): NonEmptyList<T2>
}
const list = [Right(0)] as NonEmptyList<Either<never, number>>
const v = list.sequence(Either.of)

export type ofAp<URI extends URIS> = <T>(value: T) => ApKind<URI, [T, ...any]>

export const concat = <T>(arr: Array<T>) => (arr2: Array<T>) => arr.concat(arr2)
class NonEmptyListImpl<T> extends Array<T> implements NonEmptyList<T> {
  0: T
  readonly _URI!: NON_EMPTY_LIST_URI
  readonly _A!: [T]
  sequence<Ap extends ApKind<any, any>>(
    this: NonEmptyList<Ap>,
    of: ofAp<Ap['_URI']>
  ) {
    const initialState = of(([] as any) as NonEmptyList<Ap['_A'][0]>)
    const cons = of(concat)
    return this.reduce((tail, head) => cons.ap(head).ap(tail), initialState)
  }
  map<U>(
    this: NonEmptyList<T>,
    callbackfn: (value: T, index: number, array: NonEmptyList<T>) => U,
    thisArg?: any
  ): NonEmptyList<U> {
    return this.map(callbackfn, thisArg)
  }
  chain<U>(
    this: NonEmptyList<T>,
    callbackfn: (
      value: T,
      index: number,
      array: NonEmptyList<T>
    ) => NonEmptyList<U>,
    thisArg?: any
  ): NonEmptyList<U> {
    return this.map(callbackfn, thisArg).joinM()
  }
  joinM<T2>(this: NonEmptyList<NonEmptyList<T2>>): NonEmptyList<T2> {
    return this.reduce(
      (acc, val) => acc.concat(val) as NonEmptyList<T2>,
      ([] as any) as NonEmptyList<T2>
    )
  }
  reverse(this: NonEmptyList<T>): NonEmptyList<T> {
    return this.reverse()
  }
}
export const NON_EMPTY_LIST_URI = 'NonEmptyList'
export type NON_EMPTY_LIST_URI = typeof NON_EMPTY_LIST_URI

declare module './pointfree/hkt_tst' {
  export interface URI2HKT<Types extends any[]> {
    [NON_EMPTY_LIST_URI]: NonEmptyList<Types[0]>
  }
}

export interface NonEmptyListTypeRef {
  /** Typecasts an array with at least one element into a `NonEmptyList`. Works only if the compiler can confirm that the array has one or more elements */
  <T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>
  <T, Rest extends T[]>(value1: T, ...values: Rest): NonEmptyList<T>
  /** Returns a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing` */
  fromArray<T>(source: T[]): Maybe<NonEmptyList<T>>
  /** Converts a `Tuple` to a `NonEmptyList` */
  fromTuple<T, U>(source: Tuple<T, U>): NonEmptyList<T | U>
  /** Typecasts any array into a `NonEmptyList`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative */
  unsafeCoerce<T>(source: T[]): NonEmptyList<T>
  /** Returns true and narrows the type if the passed array has one or more elements */
  isNonEmpty<T>(list: T[]): list is NonEmptyList<T>
  /** The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head */
  head<T>(list: NonEmptyList<T>): T
  /** The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element */
  last<T>(list: NonEmptyList<T>): T
  /** The same function as \`List#tail\`, but it doesn't return a Maybe as a NonEmptyList will always have a tail (although it may be of length 0) */
  tail<T>(list: NonEmptyList<T>): T[]
}
function NonEmptyListConstructor<T extends NonEmptyListCompliant<T[number]>>(
  list: T
): NonEmptyList<T[number]>
// function NonEmptyListConstructor<T>(value: T): NonEmptyList<T>
function NonEmptyListConstructor<T, Rest extends T[]>(
  value1: T,
  ...values: Rest
): NonEmptyList<T>
function NonEmptyListConstructor(...args: any[]) {
  if (args.length === 1 && Array.isArray(args[0]) && args[0].length > 0) {
    return NonEmptyListImpl.from(args[0])
  }
  return NonEmptyListImpl.of(...args)
}

export const NonEmptyList: NonEmptyListTypeRef = Object.assign(
  NonEmptyListConstructor,
  {
    fromArray: <T>(source: T[]): Maybe<NonEmptyList<T>> =>
      NonEmptyList.isNonEmpty(source) ? Just(source) : Nothing,
    unsafeCoerce: <T>(source: T[]): NonEmptyList<T> => {
      if (NonEmptyList.isNonEmpty(source)) {
        return source
      }

      throw new Error('NonEmptyList#unsafeCoerce was ran on an empty array')
    },
    fromTuple: <T, U>(source: Tuple<T, U>): NonEmptyList<T | U> =>
      NonEmptyList(source.toArray()),
    head: <T>(list: NonEmptyList<T>): T => list[0],
    last: <T>(list: NonEmptyList<T>): T => list[list.length - 1],
    isNonEmpty: <T>(list: T[]): list is NonEmptyList<T> => list.length > 0,
    tail: <T>(list: NonEmptyList<T>): T[] => list.slice(1)
  }
)

const vv = NonEmptyList([1]).chain(() => NonEmptyList(['hi']))
const slaaa = NonEmptyList(1, 2, 3, 4, 5)
const slaa2 = NonEmptyList('hola')
const slaa3 = NonEmptyList(['hola'], ['holo'])
const slaa4 = NonEmptyList([])
const slaa5 = NonEmptyList(['hoo'])
