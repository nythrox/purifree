import { Right } from '../Either'
import { Maybe } from '../Maybe'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface ToMaybeable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly toMaybe: () => Maybe<A[0]>
}

export const toMaybe = <ToMaybeM extends ToMaybeable<any, any>>() => (
  fa: ToMaybeM
): Maybe<ToMaybeM['_A'][0]> => {
  return fa.toMaybe()
}

const toMaybeTest1 = pipe(
  Right(0),
  toMaybe()
)