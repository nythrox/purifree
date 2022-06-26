import { ADT, Any, InferInner } from './types.ts'

export interface Filterable {
  readonly filter: (where: (value: Any) => boolean) => Any
}

export const filter =
  <T extends Filterable & ADT<unknown, unknown>>(
    where: (value: InferInner<T>[0]) => boolean
  ) =>
  (filterable: T): T => {
    return filterable.filter(where)
  }
