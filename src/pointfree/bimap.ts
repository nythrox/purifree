import { HKT, ReplaceFirstAndSecond, Type, URIS } from './hkt'

export interface Bimappable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly bimap: <B, C>(
    f: (value: A[1]) => C,
    g: (value: A[0]) => B
  ) => Type<F, ReplaceFirstAndSecond<A, B, C>>
}

export const bimap = <BimapM extends Bimappable<any, any>, B = any, C = any>(
  f: (value: BimapM['_A'][1]) => C,
  g: (value: BimapM['_A'][0]) => B
) => (
  fa: BimapM
): Type<BimapM['_URI'], ReplaceFirstAndSecond<BimapM['_A'], B, C>> => {
  return fa.bimap(f, g)
}