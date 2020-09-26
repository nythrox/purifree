import { MaybeAsync } from '../MaybeAsync'
import { HKT, URIS } from './hkt'

export interface ToMaybeAsyncable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly toMaybeAsync: () => MaybeAsync<A[0]>
}

export const toMaybeAsync = <ToMaybeM extends ToMaybeAsyncable<any, any>>() => (
  fa: ToMaybeM
): MaybeAsync<ToMaybeM['_A'][0]> => {
  return fa.toMaybeAsync()
}
