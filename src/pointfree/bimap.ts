import { EitherAsync, Right, Tuple } from '..'
import { chain } from './chain'
import { pipe } from './function-utils'
import {
  HKT,
  ReplaceFirstAndSecond,
  ReplaceSecond,
  Type,
  URIS
} from './hkt_tst'

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



const bmaptest = pipe(
  EitherAsync.liftEither(Right(10)),
  bimap(
    (_err) => new Error(),
    (num) => EitherAsync.liftEither<Error, string>(Right(num.toString()))
  ),
  chain((e) => e)
)
const bmaptest2 = pipe(
  Right(10),
  bimap(
    (_err) => new Error(),
    (num) => num.toString()
  )
)
const bmaptest3 = pipe(
  Tuple(1, 2),
  bimap(
    (num) => !!num,
    (num) => num.toString()
  )
)