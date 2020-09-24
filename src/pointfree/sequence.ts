import {
  Either,
  Just,
  List,
  Maybe,
  NonEmptyArray,
  NonEmptyList,
  ofAp,
  Right
} from '..'
import { EitherAsync } from '../EitherAsync'
import { ApKind } from './ap'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS, of } from './hkt_tst'
import { traverse } from './traverse'

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

// const seqtest = pipe(List(Right(0)), sequence(Either))

// const seqtest2 = pipe(NonEmptyList(Just(0)), sequence(Maybe))

const seqtestNEL = pipe(
  Right<EitherAsync<never, number>, Error>(EitherAsync.of(1)),
  sequence(EitherAsync.of)
)

// const seqtestL = pipe(
//   Right(1),
//   traverse(List, (num) => List(1))
// )
