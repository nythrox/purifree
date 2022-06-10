export type URIS = keyof URI2HKT<any>
export interface HKT<F extends URIS, A extends any[]> {
  _URI: F
  _A: A
}

export type TypeFromHKT<
  other extends HKT<any, any>,
  replaceA extends any[]
> = Type<other['_URI'], ReplaceUpTo3<other['_A'], replaceA>>

type ReplaceUpTo3<
  O extends any[],
  R extends any[],
  L = R['length']
> = L extends 3
  ? R
  : L extends 2
  ? [R[0], R[1], O[2]]
  : L extends 1
  ? [R[0], O[1], O[2]]
  : O

export type HKTFrom<
  other extends HKT<any, any>,
  A extends any[],
  uri extends URIS = other['_URI'],
  oldA extends any[] = other['_A']
> = HKT<uri, ReplaceUpTo3<oldA, A>>

export type ReplaceFirst<Arr extends any[], T extends any> = Arr extends [
  infer _Head,
  ...infer Rest
]
  ? [T, ...Rest]
  : [T, ...any]

export type ReplaceSecond<Arr extends any[], T> = Arr extends [
  infer Head,
  infer _Second,
  ...infer Rest
]
  ? [Head, T, ...Rest]
  : Arr extends [infer Head]
  ? [Head, T]
  : [undefined, T]

export type SumSecondArg<Arr extends any[], T> = Arr extends [
  infer Head,
  infer Second,
  ...infer Rest
]
  ? [Head, T | Second, ...Rest]
  : Arr extends [infer Head]
  ? [Head, T]
  : [undefined, T]
export type ReplaceFirstAndSecond<Arr extends any[], A, B> = Arr extends [
  infer _First,
  infer _Second,
  ...infer Rest
]
  ? [A, B, ...Rest]
  : [A, B]

export type OrNever<K> = unknown extends K ? never : K
export type ProtectFromNever<T> = OrNever<T> extends never ? never : T
export type ReplaceFirstAndReplaceSecondIfSecondIsNever<
  Arr extends any[],
  A,
  B
> = Arr extends [infer _First, infer Second, ...infer Rest]
  ? [A, OrNever<Second> extends never ? B : Second, ...Rest]
  : [A, B]

export type SwapFirstTwo<Arr extends any[]> = Arr extends [
  infer First,
  infer Second,
  ...infer Rest
]
  ? [Second, First, ...Rest]
  : Arr extends [infer First]
  ? [undefined, First]
  : []

export type Type<URI extends URIS, A extends any[]> = URI2HKT<A>[URI]
// Types are sorted by order of priority, not of placement (type #1 is mapped, type #1 is mapLeft, etc)
export interface URI2HKT<Types extends any[]> {}

export type of<URI extends URIS> = <T>(value: T) => HKT<URI, [T, ...any]>
