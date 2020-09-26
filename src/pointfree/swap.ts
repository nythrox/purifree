import { HKT, SwapFirstTwo, Type, URIS } from './hkt'

export interface Swappable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly swap: () => Type<F, SwapFirstTwo<A>>
}

export const swap = <SwapM extends Swappable<any, any>>() => (
  fa: SwapM
): Type<SwapM['_URI'], SwapFirstTwo<SwapM['_A']>> => {
  return fa.swap()
}
