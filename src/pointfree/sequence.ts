import { ofAp } from '..'
import { ApKind } from './ap'
import { HKT, ReplaceFirst, Type, URIS } from './hkt'

export interface SequenceableKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  // this is [ Either<L,R> ]
  readonly sequence: <Ap extends ApKind<any, any>>(
    this: Type<F, ReplaceFirst<A, Ap>>,
    of: ofAp<Ap['_URI']>
  ) => Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Type<F, Ap['_A'][0]>>>
}
export const sequence = <
  Sequenceable extends SequenceableKind<any, [ApKind<any, any>, ...any]>,
  Values extends any[] = Sequenceable extends HKT<any, infer Args>
    ? Args
    : never,
  Ap0 = Values extends any[] ? Values[0] : never,
  Ap = Ap0 extends ApKind<infer ApUri, infer ApArgs>
    ? ApKind<ApUri, ApArgs>
    : never
>(
  of: Ap extends ApKind<any, any> ? ofAp<Ap['_URI']> : never
) => (
  seq: Sequenceable
): Ap extends ApKind<any, any>
  ? Type<
      Ap['_URI'],
      ReplaceFirst<
        Ap['_A'],
        Type<Sequenceable['_URI'], ReplaceFirst<Values, Ap['_A'][0]>>
      >
    >
  : never => {
  return seq.sequence(of)
}
