import { Either, Just, Maybe, NonEmptyList, Right } from '..'
import { ApKind } from './ap'
import { pipe } from './function-utils'
import {  HKT, ReplaceFirst, Type, URIS, of } from './hkt_tst'

export interface SequenceableKind<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  // this is [ Either<L,R> ]
  readonly sequence: <Ap extends ApKind<any, any>>(
    this: Type<F, ReplaceFirst<A, Ap>>,
    of: of<Ap['_URI']>
  ) => Type<Ap['_URI'], ReplaceFirst<Ap['_A'], Type<F, Ap['_A'][0]>>>
}

export const sequence = <
  Sequenceable extends SequenceableKind<any, [ApKind<any, any>, ...any]>,
  Values = Sequenceable extends HKT<any, infer Args> ? Args : never,
  Ap0 = Values extends any[] ? Values[0] : never,
  Ap = Ap0 extends ApKind<infer ApUri, infer ApArgs>
    ? ApKind<ApUri, ApArgs>
    : never
>(
  of: Ap extends ApKind<any, any> ? of<Ap['_URI']> : never
) => (
  seq: Sequenceable
): Ap extends ApKind<any, any>
  ? Type<
      Ap['_URI'],
      ReplaceFirst<Ap['_A'], Type<Sequenceable['_URI'], Ap['_A']>>
    >
  : never => {
  return seq.sequence(of)
}


const seqtest = pipe(
  [Right(0)] as NonEmptyList<Either<never, number>>,
  sequence(Either.of)
)

const seqtest2 = pipe(
  [Just(0)] as NonEmptyList<Maybe<number>>,
  sequence(Maybe.of)
)