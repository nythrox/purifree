import { Right } from '../Either'
import { EitherAsync } from '../EitherAsync'
import { Just } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, SwapFirstTwo, Type, URIS } from './hkt_tst'

export interface Swappable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly swap: () => Type<F, SwapFirstTwo<A>>
}

export const swap = <SwapM extends Swappable<any, any>>() => (
  fa: SwapM
): Type<SwapM['_URI'], SwapFirstTwo<SwapM['_A']>> => {
  return fa.swap()
}

const orDefaultTest = pipe(Right(0), swap())
const orDefaultTest2 = pipe(EitherAsync.liftEither(Right(10)), swap())
