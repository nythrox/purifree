import { InferInner, InferADTSub, Any, ADT } from './types.ts'

export interface Swappable {
  readonly swap: () => Any
}

export const swap =
  <S extends Swappable & ADT<unknown, unknown>>() =>
  (fa: S): InferADTSub<S, InferInner<S>[1], InferInner<S>[0]> => {
    return fa.swap()
  }
