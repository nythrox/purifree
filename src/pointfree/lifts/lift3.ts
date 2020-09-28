import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'

type Lifted<F extends (a: any, b: any, c: any) => any> = <
  HKT1 extends ApKind<any, [Parameters<F>[0], ...any]>
>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [Parameters<F>[1]]>
) => (
  c: TypeFromHKT<HKT1, [Parameters<F>[2]]>
) => TypeFromHKT<HKT1, [ReturnType<F>]>

export const lift3 = <F extends (a: any, b: any, c: any) => any>(
  f: F
): Lifted<F> => (a: any) => (b: any) => (c: any) => {
  const fn = (a: any) => (b: any) => (c: any) => f(a, b, c)
  return c.ap(b.ap(a.map((a: any) => fn(a))))
}
