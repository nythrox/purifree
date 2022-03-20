import { NoInfer } from 'utils/typeUtils'
import { ApKind, ofAp } from './ap'
import { HKT, ReplaceFirst, Type, URIS } from './hkt'

export interface TraversableKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly traverse: <
    URI extends URIS,
    AP extends ApKind<any, any> = ApKind<URI, any>
  >(
    of: ofAp<URI>,
    f: (a: A[0]) => AP
  ) => Type<URI, ReplaceFirst<AP['_A'], Type<F, ReplaceFirst<A, AP['_A'][0]>>>>
}

export const traverse = <
  Traversable extends TraversableKind<any, any>,
  URI extends URIS,
  A extends any[]
  //   AP extends ApKind<URI, A>,
>(
  of: ofAp<URI>,
  f: (a: Traversable['_A'][0]) => ApKind<NoInfer<URI>, A>
) => (
  traversable: Traversable
): Type<
  URI,
  ReplaceFirst<
    A,
    Type<Traversable['_URI'], ReplaceFirst<Traversable['_A'], A[0]>>
  >
> => {
  return traversable.traverse(of, f)
}
