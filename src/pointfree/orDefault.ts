import { HKT, URIS } from './hkt'

export interface OrDefaultable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly orDefault: (defaultValue: A[0]) => A[0]
}

export const orDefault = <OrDefaultM extends OrDefaultable<any, any>>(
  defaultValue: OrDefaultM['_A'][0]
) => (fa: OrDefaultM): OrDefaultM['_A'][0] => {
  return fa.orDefault(defaultValue)
}
