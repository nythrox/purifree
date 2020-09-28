import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'
import { Ap, GetA, GetBCurried, GetReturn } from './liftBeautifiers'

type Lifted<F extends (a: any) => (b: any) => any> = <
  HKT1 extends ApKind<any, [GetA<F>, ...any]>
>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [GetBCurried<F>]>
) => TypeFromHKT<HKT1, [GetReturn<ReturnType<F>>]>

export const lift2C = <
  F extends (a: any) => (b: any) => any,
  A = Parameters<F>[0],
  B = Parameters<ReturnType<F>>[0],
  R = ReturnType<ReturnType<F>>
>(
  f: F
): Lifted<(a: Ap<A>) => (b: Ap<B>) => Ap<R>> => (
  a: any
) => (b: any) => {
  return b.ap(a.map(f))
}
