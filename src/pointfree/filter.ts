import { HKT, Type, URIS } from './hkt'

export interface Filterable<F extends URIS, A extends any[]> extends HKT<F, A> {
  readonly filter: (where: (value: A[0]) => boolean) => Type<F, A>
}

export const filter = <FilterableM extends Filterable<any, any>>(
  where: (value: FilterableM['_A'][0]) => boolean
) => (
  filterable: FilterableM
): Type<FilterableM['_URI'], FilterableM['_A']> => {
  return filterable.filter(where)
}