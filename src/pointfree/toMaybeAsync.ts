import { Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { Maybe } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface ToMaybeAsyncable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly toMaybeAsync: () => MaybeAsync<A[0]>
}

export const toMaybeAsync = <ToMaybeM extends ToMaybeAsyncable<any, any>>() => (
  fa: ToMaybeM
): MaybeAsync<ToMaybeM['_A'][0]> => {
  return fa.toMaybeAsync()
}

const toMaybeTest1 = pipe(EitherAsync.liftEither(Right(0)), toMaybeAsync())
