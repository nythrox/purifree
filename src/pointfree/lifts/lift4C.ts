import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'
import {
  Ap,
  GetA,
  GetBCurried,
  GetCCurried,
  GetDCurried,
  GetReturn
} from './liftBeautifiers'

interface Lifted<
  F extends (a: any) => (b: any) => (c: any) => (d: any) => any
> {
  <HKT1 extends ApKind<any, [GetA<F>, ...any]>>(a: HKT1): (
    b: TypeFromHKT<HKT1, [GetBCurried<F>]>
  ) => (
    c: TypeFromHKT<HKT1, [GetCCurried<F>]>
  ) => (
    d: TypeFromHKT<HKT1, [GetDCurried<F>]>
  ) => TypeFromHKT<HKT1, [GetReturn<ReturnType<ReturnType<ReturnType<F>>>>]>
}
export const lift4C = <
  F extends (a: any) => (b: any) => (c: any) => (d: any) => any,
  A = Parameters<F>[0],
  B = Parameters<ReturnType<F>>[0],
  C = Parameters<ReturnType<ReturnType<F>>>[0],
  D = Parameters<ReturnType<ReturnType<ReturnType<F>>>>[0],
  R = ReturnType<ReturnType<ReturnType<ReturnType<F>>>>
>(
  f: F
): Lifted<(a: Ap<A>) => (b: Ap<B>) => (c: Ap<C>) => (d: Ap<D>) => Ap<R>> => (
  a: any
) => (b: any) => (c: any) => (d: any) => {
  // return pipe(
  //   a,
  //   map(f),
  //   (f) => ap(f)(b),
  //   (f) => ap(f)(c),
  //   (f) => ap(f)(d)
  // )
  return d.ap(c.ap(b.ap(a.map((a: any) => f(a)))))
}
