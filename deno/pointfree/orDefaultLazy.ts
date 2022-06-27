import { ADT, Any, AsyncADT, InferInner } from './types.ts';

export interface OrDefaultLazyable {
  readonly orDefaultLazy: (getDefaultValue: () => Any) => Any;
}

export function orDefaultLazy<
  T extends OrDefaultLazyable & ADT<unknown, unknown>,
>(getDefaultValue: () => InferInner<T>[0]) {
  return (
    fa: T,
  ): T extends AsyncADT<unknown, unknown> ? Promise<InferInner<T>[0]>
    : InferInner<T>[0] => {
    return fa.orDefaultLazy(getDefaultValue);
  };
}
