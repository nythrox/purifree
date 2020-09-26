import { HKT, URIS } from './hkt'

export interface OrDefaultLazyable<F extends URIS, A extends any[]>
  extends HKT<F, A> {
  readonly orDefaultLazy: (getDefaultValue: () => A[0]) => A[0]
}

export const orDefaultLazy = <OrDefaultM extends OrDefaultLazyable<any, any>>(
  getDefaultValue: () => OrDefaultM['_A'][0]
) => (fa: OrDefaultM): OrDefaultM['_A'][0] => {
  return fa.orDefaultLazy(getDefaultValue)
}
