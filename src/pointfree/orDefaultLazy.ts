import { Right } from '../Either'
import { Just } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface OrDefaultLazyable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly orDefaultLazy: (getDefaultValue: () => A[0]) => A[0]
}

export const orDefaultLazy = <OrDefaultM extends OrDefaultLazyable<any, any>>(
  getDefaultValue: () => OrDefaultM['_A'][0]
) => (fa: OrDefaultM): OrDefaultM['_A'][0] => {
  return fa.orDefaultLazy(getDefaultValue)
}

const orDefaultLazyTest = pipe(
  Right(0),
  orDefaultLazy(() => 10)
)
const orDefaultLazyTest2 = pipe(
  Just('hello'),
  orDefaultLazy(() => 'hi')
)
