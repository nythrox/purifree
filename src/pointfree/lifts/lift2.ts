import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'

type Lifted<F extends (a: any, b: any) => any> = <
  HKT1 extends ApKind<any, [Parameters<F>[0], ...any]>
>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [Parameters<F>[1]]>
) => TypeFromHKT<HKT1, [ReturnType<F>]>

export const lift2 = <F extends (a: any, b: any) => any>(f: F): Lifted<F> => (
  a: any
) => (b: any) => {
  const fn = (a: any) => (b: any) => f(a, b)
  return b.ap(a.map(fn))
}
