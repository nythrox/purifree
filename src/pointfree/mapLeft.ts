import { HKT, ReplaceSecond, Type, URIS } from './hkt'

export interface MapLeftable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly mapLeft: <B>(f: (a: A[1]) => B) => Type<F, ReplaceSecond<A, B>>
}

export const mapLeft = <MapLeftM extends MapLeftable<any, any>, B = any>(
  f: (a: MapLeftM['_A'][1]) => B
) => (
  fa: MapLeftM
): Type<MapLeftM['_URI'], ReplaceSecond<MapLeftM['_A'], B>> => {
  return fa.mapLeft(f)
}
