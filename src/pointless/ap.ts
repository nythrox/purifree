import { Right } from '..'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface ApKind<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly ap: <R2>(
    other: Type<F, ReplaceFirst<A, (value: A[0]) => R2>>
  ) => Type<F, ReplaceFirst<A, R2>>
}

export const ap = <Ap extends ApKind<any, any>, B = any>(
  other: ApKind<Ap['_URI'], ReplaceFirst<Ap['_A'], (value: Ap['_A'][0]) => B>>
) => (fa: Ap): Type<Ap['_URI'], ReplaceFirst<Ap['_A'], B>> => {
  return fa.ap(other)
}



const sla2 = pipe(
  Right(2),
  ap(Right((num) => num * 2)),
  ap(Right((num) => num * 10))
)
