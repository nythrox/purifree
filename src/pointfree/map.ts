import { HKT, ReplaceFirst, Type, URIS } from './hkt'

export interface FunctorKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly map: <B>(f: (a: A[0]) => B) => Type<F, ReplaceFirst<A, B>>
}

export const map = <Functor extends FunctorKind<any, any>, B = any>(
  f: (a: Functor['_A'][0]) => B
) => (fa: Functor): Type<Functor['_URI'], ReplaceFirst<Functor['_A'], B>> => {
  return fa.map(f)
}
