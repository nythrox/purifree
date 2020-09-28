import { Right } from '../../Either'
import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'
import { Ap, GetA, GetReturn } from './liftBeautifiers'
// The reason for separating into Lifted is so that the return type of liftN(f) looks better
type Lifted<F extends (a: Ap<any>) => Ap<any>> = <
  HKT1 extends ApKind<any, [GetA<F>, ...any]>
>(
  a: HKT1
) => TypeFromHKT<HKT1, [GetReturn<F>]>

export const lift = <
  F extends (a: any) => any,
  A = Parameters<F>[0],
  R = ReturnType<F>
>(
  f: F
): Lifted<(a: Ap<A>) => Ap<R>> => (a: any) => {
  return a.map(f) as any
}