export declare const applicativeSymbol: unique symbol
export type applicativeSymbol = typeof applicativeSymbol
export interface Ap<T> {
  [applicativeSymbol]: T
}
type Get<
  num extends number,
  T extends (...args: Ap<any>[]) => any
> = Parameters<T>[num][applicativeSymbol]
export type GetA<T extends (...args: Ap<any>[]) => any> = Get<0, T>
export type GetB<T extends (...args: Ap<any>[]) => any> = Get<1, T>
export type GetC<T extends (...args: Ap<any>[]) => any> = Get<2, T>
export type GetD<T extends (...args: Ap<any>[]) => any> = Get<3, T>
export type GetBCurried<T extends (a: Ap<any>) => (b: Ap<any>) => any> = Get<
  0,
  ReturnType<T>
>
export type GetCCurried<
  T extends (a: Ap<any>) => (b: Ap<any>) => (c: Ap<any>) => any
> = Get<0, ReturnType<ReturnType<T>>>
export type GetDCurried<
  T extends (a: Ap<any>) => (b: Ap<any>) => (c: Ap<any>) => (d: Ap<any>) => any
> = Get<0, ReturnType<ReturnType<ReturnType<T>>>>

export type GetReturn<T extends (...args: Ap<any>[]) => any> = ReturnType<
  T
>[applicativeSymbol]
