import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'
import { Ap, GetA, GetB, GetC, GetReturn } from './liftBeautifiers'

type Lifted<
  F extends (
    a: Ap<any>,
    b: Ap<any>,
    c: Ap<any>
  ) => Ap<any>
> = <HKT1 extends ApKind<any, [GetA<F>, ...any]>>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [GetB<F>]>
) => (c: TypeFromHKT<HKT1, [GetC<F>]>) => TypeFromHKT<HKT1, [GetReturn<F>]>

export const lift3 = <
  F extends (a: any, b: any, c: any) => any,
  Params extends any[] = Parameters<F>,
  R = ReturnType<F>
>(
  f: F
): Lifted<
  (
    a: Ap<Params[0]>,
    b: Ap<Params[1]>,
    c: Ap<Params[2]>
  ) => Ap<R>
> => (a: any) => (b: any) => (c: any) => {
  const fn = (a: any) => (b: any) => (c: any) => f(a, b, c)
  return c.ap(b.ap(a.map((a: any) => fn(a))))
}
