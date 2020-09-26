import { HKT, URIS } from './hkt'

export interface Extractable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly extract: () => A[0] | A[1]
}

export const extract = <ExtractM extends Extractable<any, any>>() => (
  fa: ExtractM
): ExtractM['_A'][0] | ExtractM['_A'][1] => {
  return fa.extract()
}
