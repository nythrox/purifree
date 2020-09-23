import { Drop } from 'List/Drop'
import { ListImpl } from '.'
import { Either, Right } from './Either'
import { List } from './List'
import { Maybe, Just, Nothing } from './Maybe'
import { ApKind } from './pointfree/ap'
import { flow } from './pointfree/function-utils'
import {
  of,
  HKT,
  ReplaceFirst,
  Type,
  URIS,
  HKTFrom,
  TypeFromHKT
} from './pointfree/hkt_tst'
import { SequenceableKind } from './pointfree/sequence'
import { Tuple } from './Tuple'
export type NonEmptyArray<T> = T[] & { 0: T }

export interface NonEmptyList<T> extends NonEmptyArray<T> {
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

  ap<R2>(other: NonEmptyList<(value: T) => R2>): NonEmptyList<R2>

  joinM<T2>(this: NonEmptyList<NonEmptyList<T2>>): NonEmptyList<T2>
  'fantasy-land/traverse': this['traverse']
  'fantasy-land/sequence': this['sequence']
  'fantasy-land/map': this['map']
  'fantasy-land/chain': this['chain']
  'fantasy-land/ap': this['ap']
}
export type ofAp<URI extends URIS> = <T>(value: T) => ApKind<URI, [T, ...any]>
export const concat = <T>(arr: Array<T>) => (arr2: Array<T>) => arr.concat(arr2)
export const NON_EMPTY_LIST_URI = 'NonEmptyList'
export type NON_EMPTY_LIST_URI = typeof NON_EMPTY_LIST_URI

declare module './pointfree/hkt_tst' {
  export interface URI2HKT<Types extends any[]> {
    [NON_EMPTY_LIST_URI]: NonEmptyList<Types[0]>
  }
}

export interface NonEmptyListTypeRef {
  /** Typecasts an array with at least one element into a `NonEmptyList`. Works only if the compiler can confirm that the array has one or more elements */
  <T extends NonEmptyArray<T[number]>>(list: T): NonEmptyList<T[number]>
  <T, Rest extends T[]>(value1: T, ...values: Rest): NonEmptyList<T>
  of<T>(val: T): NonEmptyList<T>
  /** Returns a `Just NonEmptyArray` if the parameter has one or more elements, otherwise it returns `Nothing` */
  fromArray<T>(source: T[]): Maybe<NonEmptyList<T>>
  /** Converts a `Tuple` to a `NonEmptyArray` */
  fromTuple<T, U>(source: Tuple<T, U>): NonEmptyArray<T | U>
  /** Typecasts any array into a `NonEmptyArray`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative */
  unsafeCoerce<T>(source: T[]): NonEmptyArray<T>
  /** Returns true and narrows the type if the passed array has one or more elements */
  isNonEmpty<T>(list: T[]): list is NonEmptyArray<T>
  /** The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyArray will always have a head */
  head<T>(list: NonEmptyArray<T>): T
  /** The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyArray will always have a last element */
  last<T>(list: NonEmptyArray<T>): T
  /** The same function as \`List#tail\`, but it doesn't return a Maybe as a NonEmptyArray will always have a tail (although it may be of length 0) */
  tail<T>(list: NonEmptyArray<T>): T[]
}
function NonEmptyListConstructor<T extends NonEmptyArray<any>>(
  list: T
): NonEmptyList<T[number]>
function NonEmptyListConstructor<T, Rest extends T[]>(
  value1: T,
  ...values: Rest
): NonEmptyList<T>
function NonEmptyListConstructor(...args: any[]) {
  if (args.length === 1 && Array.isArray(args[0]) && args[0].length > 0) {
    console.log('returning NonEmptyListImpl.from')
    return ListImpl.from(args[0])
  }
  return (ListImpl as any).of(...args)
}

export const NonEmptyList: NonEmptyListTypeRef = Object.assign(
  NonEmptyListConstructor,
  {
    of: <T>(val: T) => (new ListImpl(val) as unknown) as NonEmptyList<T>,
    fromArray: <T>(source: T[]): Maybe<NonEmptyList<T>> =>
      NonEmptyList.isNonEmpty(source) ? Just(NonEmptyList(source)) : Nothing,
    unsafeCoerce: <T>(source: T[]): NonEmptyArray<T> => {
      if (NonEmptyList.isNonEmpty(source)) {
        return source
      }

      throw new Error('NonEmptyList#unsafeCoerce was ran on an empty array')
    },
    fromTuple: <T, U>(source: Tuple<T, U>): NonEmptyArray<T | U> =>
      NonEmptyList(source.toArray()),
    head: <T>(list: NonEmptyArray<T>): T => list[0],
    last: <T>(list: NonEmptyArray<T>): T => list[list.length - 1],
    isNonEmpty: <T>(list: T[]): list is NonEmptyArray<T> => list.length > 0,
    tail: <T>(list: NonEmptyArray<T>): T[] => list.slice(1)
  }
)

// const vv = NonEmptyList([1]).chain(() => NonEmptyList(['hi']))
// const slaaa = NonEmptyList(1, 2, 3, 4, 5)
// const hoi = NonEmptyList(List(1, 2, 3))
// const slaa2 = NonEmptyList('hola')
// const slaa3 = NonEmptyList(['hola'], ['holo'])
// const slaa5 = NonEmptyList(['hoo'])
// const slaa6 = NonEmptyList(NonEmptyList(1, 2, 3, 4))
// const list = NonEmptyList(Right(0))
// const v = list.sequence(Either.of)

// const test = NonEmptyList(1, 2, 3).traverse(Either.of, (num) => Right(num))

// const test2 = NonEmptyList(1, 2, 3).traverse(Maybe.of, (num) => Just(num))
