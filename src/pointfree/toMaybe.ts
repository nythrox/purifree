import { Maybe } from '../Maybe'
import { HKT, URIS } from './hkt'

export interface ToMaybeable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly toMaybe: () => Maybe<A[0]>
}

export const toMaybe = <ToMaybeM extends ToMaybeable<any, any>>() => (
  fa: ToMaybeM
): Maybe<ToMaybeM['_A'][0]> => {
  return fa.toMaybe()
}
