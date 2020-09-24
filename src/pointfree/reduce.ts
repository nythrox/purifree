import { HKT, URIS } from './hkt_tst'

export interface ReduceableKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  reduce<T2>(
    reducer: (accumulator: T2, value: A[0]) => T2,
    initialValue: T2
  ): T2
}
export const reduce = <Reduceable extends ReduceableKind<any, any>, T2 = any>(
  reducer: (accumulator: T2, value: Reduceable['_A'][0]) => T2,
  initialValue: T2
) => (reduceable: Reduceable): T2 => {
  return reduceable.reduce(reducer, initialValue)
}
