import { ADT, InferInner, Any, AsyncADT } from './types.ts'

export interface OrDefaultLazyable {
  readonly orDefaultLazy: (getDefaultValue: () => Any) => Any
}

export const orDefaultLazy =
  <T extends OrDefaultLazyable & ADT<unknown, unknown>>(
    getDefaultValue: () => InferInner<T>[0]
  ) =>
  (
    fa: T
  ): T extends AsyncADT<unknown, unknown>
    ? Promise<InferInner<T>[0]>
    : InferInner<T>[0] => {
    return fa.orDefaultLazy(getDefaultValue)
  }
