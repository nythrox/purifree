import { List } from '../List'
import { ApKind, ofAp } from './ap'
import { IsUnion } from './do'
import { ReplaceFirst, Type } from './hkt'
// type test<T extends ApKind<'Either', any>[]> = T
// type smh = test<[Either<never, number>]>
export const sequenceT = <Of extends ofAp<any>>(of: Of) => <
  Ap extends ApKind<any, any[]> = ReturnType<Of>,
  T extends Array<ApKind<Ap['_URI'], any>> = any,
  Rest extends any[] = T[number]['_A'] extends [infer _Head, ...infer Rest]
    ? Rest
    : never
>(
  ...t: IsUnion<Rest> extends true
    ? [
        'ERROR: All secondary generics must be of the same type. Different generics found: ',
        Rest[number]
      ][]
    : T
): IsUnion<Rest> extends true
  ? [
      'ERROR: All secondary generics must be of the same type. Different generics found: ',
      Rest[number]
    ]
  : Type<
      Ap['_URI'],
      ReplaceFirst<
        T extends never ? [] : T[number]['_A'],
        { [K in keyof T]: T[K] extends ApKind<any, infer A> ? A[0] : never }
      >
    > => {
  return List(t as any).sequence(of) as any
}

export const sequenceTFlex = <Of extends ofAp<any>>(of: Of) => <
  Ap extends ApKind<any, any> = ReturnType<Of>,
  T extends Array<ApKind<Ap['_URI'], any>> = any
>(
  ...t: T
): Type<
  Ap['_URI'],
  ReplaceFirst<
    T[number]['_A'],
    { [K in keyof T]: T[K] extends ApKind<any, infer A> ? A[0] : never }
  >
> => {
  return List(t as T).sequence(of)
}
