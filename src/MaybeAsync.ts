import { MaybeAsync } from 'purify-ts'
import { Nothing } from './Maybe'
import { Type } from './pointfree/hkt'

export const MAYBE_ASYNC_URI = 'MaybeAsync'
export type MAYBE_ASYNC_URI = typeof MAYBE_ASYNC_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [MAYBE_ASYNC_URI]: MaybeAsync<Types[0]>
  }
}

declare module 'purify-ts/MaybeAsync' {
  interface MaybeAsync<T> {
    readonly _URI: MAYBE_ASYNC_URI
    readonly _A: [T]

    [Symbol.iterator]: () => Iterator<Type<MAYBE_ASYNC_URI, [T]>, T, T>
    [Symbol.toStringTag]: 'MaybeAsync'
    // [ofSymbol]: MaybeAsyncTypeRef['of']
  }
}

const _maybeAsync = Object.getPrototypeOf(MaybeAsync.liftMaybe(Nothing))
_maybeAsync[Symbol.toStringTag] = 'MaybeAsync'
_maybeAsync[Symbol.iterator] = function* (): any {
  return yield this
}
// [ofSymbol] = MaybeAsync.of

export { MaybeAsync }
