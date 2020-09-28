import { Right } from '../../Either'
import { ApKind } from '../ap'
import { TypeFromHKT } from '../hkt'
// The reason for separating into Lifted is so that the return type of liftN(f) looks better
type Lifted<F extends (a: any) => any> = <
  HKT1 extends ApKind<any, [Parameters<F>[0], ...any]>
>(
  a: HKT1
) => TypeFromHKT<HKT1, [ReturnType<F>]>
export const lift = <F extends (a: any) => any>(f: F): Lifted<F> => (
  a: any
) => {
  return a.map(f) as any
}
const toString = (obj: any) => obj.toString() as string
const toStringL = lift(toString)
const result = toStringL(Right(10))
