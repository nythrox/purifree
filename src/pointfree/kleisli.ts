import { Chainable } from './chain'
import { HKTFrom, ReplaceFirst, Type, TypeFromHKT, URIS } from './hkt'

type KleisliFunction<URI extends URIS, A, B> = (
  value: A
) => Chainable<URI, ReplaceFirst<any, B>>

type KleisiInfo = {
  Monad: Chainable<any, any>
  URI: URIS
  Generics: any[]
  A: any
}
type getKleisiInfo<
  T extends (...args: any) => Chainable<any, any>,
  Monad extends Chainable<any, any> = ReturnType<T>,
  URI extends URIS = Monad['_URI'],
  Generics extends any[] = Monad['_A'],
  A = Monad['_A'][0]
> = { Monad: Monad; URI: URI; Generics: Generics; A: A }

export function kleisli<
  func1 extends (...args: any) => Chainable<any, any>,
  info extends KleisiInfo = getKleisiInfo<func1>
>(a: func1): (...args: Parameters<func1>) => TypeFromHKT<info['Monad'], []>
export function kleisli<
  func1 extends (...args: any) => Chainable<any, any>,
  info extends KleisiInfo = getKleisiInfo<func1>,
  B = any
>(
  a: func1,
  b: (arg: info['A']) => HKTFrom<info['Monad'], [B]>
): (...args: Parameters<func1>) => TypeFromHKT<info['Monad'], [B]>
export function kleisli<
  func1 extends (...args: any) => Chainable<any, any>,
  info extends KleisiInfo = getKleisiInfo<func1>,
  B = any,
  C = any
>(
  a: func1,
  b: (arg: info['A']) => HKTFrom<info['Monad'], [B]>,
  c: (arg: B) => HKTFrom<info['Monad'], [C]>
): (...args: Parameters<func1>) => TypeFromHKT<info['Monad'], [C]>
export function kleisli<
  func1 extends (...args: any) => Chainable<any, any>,
  info extends KleisiInfo = getKleisiInfo<func1>,
  B = any,
  C = any,
  D = any
>(
  a: func1,
  b: (arg: info['A']) => HKTFrom<info['Monad'], [B]>,
  c: (arg: B) => HKTFrom<info['Monad'], [C]>,
  d: (arg: C) => HKTFrom<info['Monad'], [D]>
): (...args: Parameters<func1>) => TypeFromHKT<info['Monad'], [D]>

export function kleisli<
  func1 extends (...args: any) => Chainable<any, any>,
  info extends KleisiInfo = getKleisiInfo<func1>,
  B = any,
  C = any,
  D = any,
  E = any
>(
  a: func1,
  b: (arg: info['A']) => HKTFrom<info['Monad'], [B]>,
  c: (arg: B) => HKTFrom<info['Monad'], [C]>,
  d: (arg: C) => HKTFrom<info['Monad'], [D]>,
  e: (arg: D) => HKTFrom<info['Monad'], [E]>
): (...args: Parameters<func1>) => TypeFromHKT<info['Monad'], [E]>

export function kleisli<
  func1 extends (...args: any) => Chainable<any, any>,
  info extends KleisiInfo = getKleisiInfo<func1>,
  B = any,
  C = any,
  D = any,
  E = any,
  F = any
>(
  a: func1,
  b: (arg: info['A']) => HKTFrom<info['Monad'], [B]>,
  c: (arg: B) => HKTFrom<info['Monad'], [C]>,
  d: (arg: C) => HKTFrom<info['Monad'], [D]>,
  e: (arg: D) => HKTFrom<info['Monad'], [E]>,
  f: (arg: E) => HKTFrom<info['Monad'], [F]>
): (...args: Parameters<func1>) => TypeFromHKT<info['Monad'], [F]>

export function kleisli<
  T extends KleisliFunction<any, any, any>[],
  M extends Chainable<any, any> = ReturnType<T[0]>
>(...fns: T) {
  const [head, ...rest] = fns
  return (...args: Parameters<T[0]>): Type<M['_URI'], any> => {
    return rest.reduce((prev, cur) => prev.chain(cur), (head as any)(...args))
  }
}
