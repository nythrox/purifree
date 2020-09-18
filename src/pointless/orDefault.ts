import { Right } from '../Either'
import { Just } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface OrDefaultable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly orDefault: (defaultValue: A[0]) => A[0]
}

export const orDefault = <OrDefaultM extends OrDefaultable<any, any>>(
  defaultValue: OrDefaultM['_A'][0]
) => (fa: OrDefaultM): OrDefaultM['_A'][0] => {
  return fa.orDefault(defaultValue)
}

const orDefaultTest = pipe(Right(0), orDefault(10))
const orDefaultTest2 = pipe(
  Just('hello'),
  orDefault('hi')
)


