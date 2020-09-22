import { Left, Right } from '..'
import { pipe } from './function-utils'
import { HKT, Type, URIS } from './hkt_tst'
export interface Altable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly alt: (other: Type<F, A>) => Type<F, A>
}

export const alt = <Alt extends Altable<any, any>>(other: Alt) => (
  fa: Alt
): Alt => {
  return fa.alt(other)
}

const sla2 = pipe(
  Right(2),
  alt(Right(2)),
  alt(Left(Error()))
)
