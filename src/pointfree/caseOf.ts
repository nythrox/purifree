// import { Just, Maybe, MaybePatterns, Nothing } from '../Maybe'
// import { Either, EitherPatterns, Left, Right } from '../Either'
// import { EitherAsync } from '../EitherAsync'
// import { pipe, flow, identity } from './function-utils'
// import { MaybeAsync } from '../MaybeAsync'
// import { Tuple } from '../Tuple'
// import { NonEmptyList } from '../NonEmptyList'

import { Either, EitherPatterns, Maybe, MaybePatterns } from '..'

// // Try one - Doesnt work: Overload will always choose the first function
// // interface Map {
// //   <R, R2, L>(mapper: (val: R) => R2): (
// //     m: EitherAsync<L, R>
// //   ) => EitherAsync<L, R2>
// //   <R, R2, L>(mapper: (val: R) => R2): (m: Either<L, R>) => Either<L, R2>

// //   <T, T2>(mapper: (val: T, index: number, arr: NonEmptyList<T>) => T2): (
// //     m: NonEmptyList<T>
// //   ) => NonEmptyList<T2>
// //   <T, T2>(mapper: (val: T) => T2): (m: Maybe<T>) => Maybe<T2>
// //   <T, T2>(mapper: (val: T) => T2): (m: MaybeAsync<T>) => MaybeAsync<T2>
// //   <T, T2>(mapper: (val: T) => T2): (m: Mappable<T>) => Mappable<T2>
// //   <F, S, S2>(mapper: (val: S) => S2): (m: Tuple<F, S>) => Either<F, S2>
// // }

// // // Try two - Doesnt work: Overload will always choose the first function
// // interface Map {
// //   <T, T2>(mapper: (val: T) => T2): <L>(m: Either<L, T>) => Either<L, T2>
// //   <T, T2>(mapper: (val: T) => T2): <L>(
// //     m: EitherAsync<L, T>
// //   ) => EitherAsync<L, T2>

// //   <T, T2>(mapper: (val: T, index: number, arr: NonEmptyList<T>) => T2): (
// //     m: NonEmptyList<T>
// //   ) => NonEmptyList<T2>
// //   <F, S, S2>(mapper: (val: S) => S2): (m: Tuple<F, S>) => Either<F, S2>
// //   <T, T2>(mapper: (val: T) => T2): (m: Maybe<T>) => Maybe<T2>
// //   <T, T2>(mapper: (val: T) => T2): (m: MaybeAsync<T>) => MaybeAsync<T2>
// //   <T, T2>(mapper: (val: T) => T2): (m: Mappable<T>) => Mappable<T2>
// // }

// // // Try three - Doesnt work: Overload will always choose the last function
// // interface Map {
// //   <T, T2, L = unknown>(mapper: (val: T) => T2): MapS<T, T2, L>
// // }

// // interface MapS<T, T2, L> {
// //   (m: Mappable<T>): Mappable<T2>
// //   (m: Maybe<T>): Maybe<T2>
// //   (m: Either<L, T>): Either<L, T2>
// //   (m: EitherAsync<L, T>): EitherAsync<L, T2>
// //   (m: NonEmptyList<T>): NonEmptyList<T2>
// //   (m: MaybeAsync<T>): MaybeAsync<T2>
// // }

// // // Try four - Doesnt work: Overload will always choose the last function
// // interface Map {
// //   <T, T2>(mapper: (val: T) => T2): MapS3<T, T2>
// // }

// // interface MapS3<T, T2> {
// //   (m: Mappable<T>): Mappable<T2>
// //   (m: Maybe<T>): Maybe<T2>
// //   <L>(m: Either<L, T>): Either<L, T2>
// //   <L>(m: EitherAsync<L, T>): EitherAsync<L, T2>
// //   (m: MaybeAsync<T>): MaybeAsync<T2>
// //   (m: NonEmptyList<T>): NonEmptyList<T2>
// // }
// type sera = Either<Error, number> extends Mappable<number> ? true : false
// type sera2 = Either<Error, number> extends Chainable<number> ? true : false
// type Mappable<T> = {
//   map<T2>(f: (value: T) => T2): Mappable<T2>
// }
// type Chainable<T> = {
//   chain<T2>(f: (value: T) => Chainable<T2>): Chainable<T2>
// }

// type Applicable<T> = {
//   ap<T2>(other: Applicable<(value: T) => T2>): Applicable<T2>
// }
// type Bimappable<L, R> = {
//   bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Bimappable<L2, R2>
// }

// interface Map {
//   <M extends Mappable<any>, T = get_1T_ofADT<M>, T2 = any>(
//     mapper: (val: T) => T2
//   ): (monad: M) => change_1T_ofADT<M, T2>
// }

// interface Chain {
//   <
//     M extends Chainable<any>,
//     T = get_1T_ofADT<M>,
//     R extends change_1T_ofADT<M, any> = change_1T_ofADT<M, any>,
//     T2 = get_1T_ofADT<R>
//   >(
//     chainer: (val: T) => R
//   ): (monad: M) => change_1T_ofADT<M, T2>
// }
interface CaseOfable {
  caseOf<T>(pattern: any): T
}
export type CaseOf = {
  <
    M extends CaseOfable,
    P extends getPatternsOfADT<M>,
    T2 = getReturn_T_ofPattern<P>
  >(
    p: P
  ): (m: M) => T2
}
export type Match = CaseOf
export const caseOf: CaseOf = (p) => (m) => m.caseOf(p)
export const match: Match = (p) => (m) => m.caseOf(p)
type getPatternsOfADT<M> = M extends Either<infer L, infer R>
  ? EitherPatterns<L, R, any>
  : M extends Maybe<infer T>
  ? MaybePatterns<T, any>
  : never
type getReturn_T_ofPattern<P> = P extends
  | EitherPatterns<any, any, infer R>
  | EitherPatterns<any, never, infer R>
  | EitherPatterns<never, any, infer R>
  ? R
  : P extends MaybePatterns<any, infer R> | MaybePatterns<never, infer R>
  ? R
  : never

// type Ap = {
//   <
//     M extends Applicable<any>,
//     T = get_1T_ofADT<M>,
//     R extends change_1T_ofADT<M, (value: T) => any> = change_1T_ofADT<
//       M,
//       (value: T) => any
//     >,
//     F = get_1T_ofADT<R>,
//     T2 = F extends (...args: any) => infer R ? R : never
//   >(
//     other: R
//   ): (applicable: M) => change_1T_ofADT<M, T2>
// }
// type Bimap = {
//   <
//     M extends Bimappable<any, any>,
//     L = get_T_ofADT<M>[1],
//     R = get_T_ofADT<M>[0],
//     L2 = any,
//     R2 = any
//   >(
//     f: (value: L) => L2,
//     g: (value: R) => R2
//   ): (bimappable: M) => change_T_ofADT<M, [R2, L2]>
// }
// const ap: Ap = (other) => (either) => either.ap(other as any) as any

// const bimap: Bimap = (f, g) => (bimappable) => bimappable.bimap(f, g) as any

// const chain: Chain = (chainer) => (chainable) =>
//   chainable.chain(chainer as any) as any

// const map: Map = (mapper) => (m) => m.map(mapper) as any

// type Reduceable<T> = {
//   reduce<T2>(reducer: (accumulator: T2, value: T) => T2, initialValue: T2): T2
// }
// type Reduce = {
//   <M extends Reduceable<any>, T = get_1T_ofADT<M>, T2 = any>(
//     reducer: (accumulator: T2, value: T) => T2,
//     initialValue: T2
//   ): (m: M) => T2
// }
// const reduce: Reduce = (reducer, initialValue) => (m) =>
//   m.reduce(reducer, initialValue) as any

// type test1 = get_T_ofADT<Either<number, string>>
// type test2 = change_T_ofADT<Either<any, any>, [number, string]>
// // gets the main T of a Algebraic Data Type (Either<_,T>, Option<T>, Tuple<_,T>)
// type get_T_ofADT<M> = M extends Either<infer B, infer A>
//   ? [A, B]
//   : M extends EitherAsync<infer B, infer A>
//   ? [A, B]
//   : M extends Tuple<infer B, infer A>
//   ? [A, B]
//   : M extends Maybe<infer A>
//   ? [A]
//   : M extends MaybeAsync<infer A>
//   ? [A]
//   : M extends NonEmptyList<infer A>
//   ? [A]
//   : never

// // gets the main T of a Algebraic Data Type (Either<_,T>, Option<T>, Tuple<_,T>)

// type change_T_ofADT<M, T extends any[]> = M extends Either<any, any>
//   ? Either<T[1], T[0]>
//   : M extends EitherAsync<any, any>
//   ? EitherAsync<T[1], T[0]>
//   : M extends Tuple<any, any>
//   ? Tuple<T[1], T[0]>
//   : M extends Maybe<any>
//   ? Maybe<T[0]>
//   : M extends MaybeAsync<any>
//   ? MaybeAsync<T[0]>
//   : M extends NonEmptyList<any>
//   ? NonEmptyList<T[0]>
//   : never

// type get_1T_ofADT<M> = get_T_ofADT<M>[0]
// type change_1T_ofADT<M, T2> = change_T_ofADT<M, [T2]>
// type get_2T_ofADT<M> = {
//   primary: get_T_ofADT<M>[0]
//   secondary: get_T_ofADT<M>[1]
// }
// type change_2T_ofADT<M, P, S> = change_T_ofADT<M, [P, S]>

// const v = pipe(
//   Right(1),
//   map((e) => 'hi'),
//   ap(Right((e: string) => '')),
//   // caseOf({
//   //   Right: (n) => 'ola',
//   //   Left: (err) => 'hello'
//   // })
//   map((e) => e)
// )
// const bimap1 = pipe(
//   Right('jason'),
//   bimap(
//     (err) => new Error('hi'),
//     (name) => 10
//   )
// )
// const bimap2 = pipe(
//   Tuple(10, 'jason'),
//   bimap(
//     (num) => num * 100,
//     (name) => name
//   )
// )
// const bimap3 = pipe(
//   EitherAsync.liftEither(Right('jason')),
//   bimap(
//     (err) => new Error('hi'),
//     (name) => 10
//   )
// )
// const d = pipe(
//   EitherAsync.liftEither(Right(0)),
//   map((e) => 'hi')
//   // mapLeft((err) => new Error('bad num'))
// )

// const b = pipe(
//   NonEmptyList([0]),
//   map((num) => num * 2)
// )

// const c = pipe(
//   Just(0),
//   map((num) => 'hi'),
//   map((e) => Right(e)),
//   match({
//     Just: (e) => '',
//     Nothing: () => 'hello world'
//   })
// )

// const ftr = pipe(
//   EitherAsync.liftEither(Right(0)),
//   chain((e) => EitherAsync.liftEither(Right(e.toString())))
// )

// const mbs = pipe(
//   MaybeAsync.liftMaybe(Just(0)),
//   chain((e) => MaybeAsync.liftMaybe(Just(e.toString()))),
//   chain((e) => {
//     if (e == '2') return MaybeAsync.liftMaybe(Just(4))
//     return MaybeAsync.liftMaybe(Just(4))
//   })
// )

// const test = pipe(
//   Right(0),
//   map((num) => Just(num.toString())),
//   match({
//     Right: (e) => Just(e),
//     Left: () => Nothing
//   }),
//   chain((a) => a),
//   match({
//     Just: (e) => Right(e),
//     Nothing: () => Left(new Error())
//   }),
//   bimap(
//     () => new Error('somethign went wrong'),
//     (val) => 'hello, ' + val
//   ),
//   map((e) => e.length),
//   map((length) => Array.from({ length }).map((_, i) => i)),
//   map(flow(reduce((acc, curr) => acc + curr, 0)))
// )
