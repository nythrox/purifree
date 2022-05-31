import { EitherAsync } from 'purify-ts'
import { Right } from './Either'
import { Type } from './pointfree/hkt'

export const EITHER_ASYNC_URI = 'EitherAsync'
export type EITHER_ASYNC_URI = typeof EITHER_ASYNC_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [EITHER_ASYNC_URI]: EitherAsync<Types[1], Types[0]>
  }
}

declare module 'purify-ts/EitherAsync' {
  interface EitherAsync<L, R> {
    readonly _URI: EITHER_ASYNC_URI
    readonly _A: [R, L]

    // [ofSymbol]: EitherAsync<L, R>['of']
    [Symbol.iterator]: () => Iterator<Type<EITHER_ASYNC_URI, [R, L]>, R, any>
    [Symbol.toStringTag]: 'EitherAsync'
  }

  interface EitherAsyncTypeRef {
    of<L = never, R = any>(value: R): EitherAsync<L, R>
  }
}

const _eitherAsync = Object.getPrototypeOf(
  EitherAsync(() => Promise.resolve(undefined))
)
_eitherAsync[Symbol.toStringTag] = 'EitherAsync'
_eitherAsync[Symbol.iterator] = function* (): any {
  return yield this
}

EitherAsync.of = <L, R>(value: R): EitherAsync<L, R> =>
  EitherAsync.liftEither(Right(value))

export * from 'purify-ts/EitherAsync'
