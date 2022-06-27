import { MaybeAsync } from 'purify'
import { Any, InferInner } from './types.ts'

export interface ToMaybeAsync {
  readonly toMaybeAsync: () => MaybeAsync<Any>
}

export const toMaybeAsync =
  <T extends ToMaybeAsync>() =>
  (fa: T): MaybeAsync<InferInner<T>[0]> => {
    return fa.toMaybeAsync()
  }
