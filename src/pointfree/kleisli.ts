import { Nothing } from '..'
import { Just } from '../Maybe'
import { Chainable } from './chain'
import { HKTFrom, ReplaceFirst, Type, TypeFromHKT, URIS } from './hkt_tst'

type KleisliFunction<URI extends URIS, A, B> = (
  value: A
) => Chainable<URI, ReplaceFirst<any, B>>

/*
    def andThen[C](f: B => M[C])
                  (implicit M: Monad[M]): Kleisli[M, A, C] =
     Kleisli((a: A) => M.flatMap(run(a))(f))
  
  */
/*
    def flatMap[C](f: B => Kleisli[M, A, C])
                  (implicit M: Monad[M]): Kleisli[M, A, C] =
      Kleisli((a: A) => M.flatMap[B, C](run(a))(((b: B) => f(b).run(a))))
  
      */

// class Kleisi<URI extends URIS, A, B> {
//   constructor(private run: (value: A) => Type<URI, [B]>) {}
//   andThen<C>(
//     this: Type<URI, any> extends MonadKind<any, any> ? any : never,
//     // this: Kleisi<'Either', A,B>
//     f: (value: B) => Type<URI, [C]>
//   ): Kleisi<URI, A, C> {
//     return new Kleisi((a) => (this as any).run(a).chain(f))
//   }

// }

// const kleisi = <URI extends URIS, A, B>(f: KleisliFunction<URI, A, B>) => f

// const hoi: KleisliFunction<'Maybe', string, string> = (name: string) =>
//   Just(name)
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
// function kleisiFlow(...fns: KleisliFunction<'Maybe', number, number>[]) {
//   return (...args: [value: number]): Maybe<number> => {
//     const [head, ...rest] = fns
//     return rest.reduce((prev, cur) => prev.chain(cur), head(...args))
//   }
// }

// const kleisiFlow = <
//   func1 extends (...args: any) => Chainable<any, any>,
//   Monad extends Chainable<any, any> = ReturnType<func1>,
//   URI extends URIS = Monad['_URI'],
//   Generics extends any[] = Monad['_A'],
//   A = Monad['_A'][0],
//   B = any
// >(
//   a: func1,
//   b: (arg: A) => HKT<URI extends infer U ? U : never, ReplaceFirst<Generics, B>>
// ) => (
//   ...args: Parameters<func1>
// ): Type<Monad['_URI'], ReplaceFirst<Monad['_A'], B>> => {
//   const res1 = a(...args)
//   return res1.chain(b)
// }
// const getNameTest = kleisiFlow(
//   (name: string) => Just(name.toUpperCase()),
//   (_name) => Just(5),
//   (_name) => Just(5),
//   (_smh) => Nothing
// )
// const result = getNameTest('jason')

/* 
  final case class Kleisli[F[_], A, B](run: A => F[B]) {
    def compose[Z](k: Kleisli[F, Z, A])(implicit F: FlatMap[F]): Kleisli[F, Z, B] =
      Kleisli[F, Z, B](z => k.run(z).flatMap(run))
  }
  */
