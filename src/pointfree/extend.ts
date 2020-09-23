import { Right } from '..'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'

export interface Extendable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly extend: <B>(f: (a: Type<F, A>) => B) => Type<F, ReplaceFirst<A, B>>
}

export const extend = <ExtendableM extends Extendable<any, any>, B = any>(
  f: (a: Type<ExtendableM['_URI'], ExtendableM['_A']>) => B
) => (
  fa: ExtendableM
): Type<ExtendableM['_URI'], ReplaceFirst<ExtendableM['_A'], B>> => {
  return fa.extend(f)
}

// const test = pipe(
//   Right(5),
//   extend((e) => e.inspect())
// )
