import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'

type Lifted<F extends (a: any) => (b: any) => (c: any) => any> = <
  HKT1 extends ApKind<any, [Parameters<F>[0], ...any]>
>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [Parameters<ReturnType<F>>[0]]>
) => (
  c: TypeFromHKT<HKT1, [Parameters<ReturnType<ReturnType<F>>>[0]]>
) => TypeFromHKT<HKT1, [ReturnType<ReturnType<ReturnType<F>>>]>

export const lift3C = <F extends (a: any) => (b: any) => (c: any) => any>(
  f: F
): Lifted<F> => (a: any) => (b: any) => (c: any) => {
  return c.ap(b.ap(a.map((a: any) => f(a))))
}
