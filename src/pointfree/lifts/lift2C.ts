import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'

type Lifted<F extends (a: any) => (b: any) => any> = <
  HKT1 extends ApKind<any, [Parameters<F>[0], ...any]>
>(
  a: HKT1
) => (
  b: TypeFromHKT<HKT1, [Parameters<ReturnType<F>>[0]]>
) => TypeFromHKT<HKT1, [ReturnType<ReturnType<F>>]>

export const lift2C = <F extends (a: any) => (b: any) => any>(
  f: F
): Lifted<F> => (a: any) => (b: any) => {
  return b.ap(a.map(f))
}
