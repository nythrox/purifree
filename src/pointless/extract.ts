import { Right } from '../Either'
import { Just } from '../Maybe'
import { MaybeAsync } from '../MaybeAsync'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface Extractable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly extract: () => A[0] | A[1]
}

export const extract = <ExtractM extends Extractable<any, any>>() => (
  fa: ExtractM
): ExtractM['_A'][0] | ExtractM['_A'][1] => {
  return fa.extract()
}

const orDefaultTest = pipe(Right(0), extract())
const orDefaultTest2 = pipe(Just('hello'), extract())
