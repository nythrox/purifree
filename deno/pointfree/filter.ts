import { ADT, Any, InferInner } from './types.ts';

export interface Filterable {
  readonly filter: (where: (value: Any) => boolean) => Any;
}

export function filter<T extends Filterable & ADT<unknown, unknown>>(
  where: (value: InferInner<T>[0]) => boolean,
) {
  return (filterable: T): T => {
    return filterable.filter(where);
  };
}
