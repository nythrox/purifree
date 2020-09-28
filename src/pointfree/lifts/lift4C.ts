import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'

type Lifted<F extends (a: any) => (b: any) => (c: any) => (d: any) => any> = <
  HKT1 extends ApKind<any, [Parameters<F>[0], ...any]>
>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [Parameters<ReturnType<F>>[0]]>
) => (
  c: TypeFromHKT<HKT1, [Parameters<ReturnType<ReturnType<F>>>[0]]>
) => (
  d: TypeFromHKT<HKT1, [Parameters<ReturnType<ReturnType<ReturnType<F>>>>[0]]>
) => TypeFromHKT<HKT1, [ReturnType<ReturnType<ReturnType<ReturnType<F>>>>]>

export const lift4C = <
  F extends (a: any) => (b: any) => (c: any) => (d: any) => any
>(
  f: F
): Lifted<F> => (a: any) => (b: any) => (c: any) => (d: any) => {
  // return pipe(
  //   a,
  //   map(f),
  //   (f) => ap(f)(b),
  //   (f) => ap(f)(c),
  //   (f) => ap(f)(d)
  // )
  return d.ap(c.ap(b.ap(a.map((a: any) => f(a)))))
}