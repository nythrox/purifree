import { Just } from '../Maybe'
import { match } from './caseOf'
import { pipe } from './function-utils'
import { HKT, ReplaceFirst, Type, URIS } from './hkt_tst'
import { map } from './map'
import { orDefault } from './orDefault'

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

const filterTest1 = pipe(
  Just(5),
  filter((val) => val > 5),
  map((n) => n.toString()),
  filter((val) => val.toString() === '5'),
)
