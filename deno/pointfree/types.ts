import {
  Maybe,
  Either,
  EitherAsync,
  MaybeAsync,
  Tuple,
  NonEmptyList
} from 'purify-ts'

export type Eithers<L, R> = Either<L, R> | EitherAsync<L, R>
export type Maybes<T> = Maybe<T> | MaybeAsync<T>

export type ADT<R, L> =
  | Eithers<L, R>
  | Maybes<R>
  //   | NonEmptyList<R>
  | Tuple<L, R>

export type AsyncADT<R, L> = EitherAsync<L, R> | MaybeAsync<R>
export type SyncADT<R, L> = Either<L, R> | Maybe<R> | Tuple<L, R>

export type InferInner<T> = T extends ADT<infer R, infer L> ? [R, L] : never

export type InferADT<T> = T extends Either<infer L, infer R>
  ? Either<L, R>
  : T extends Maybe<infer R>
  ? Maybe<R>
  : T extends Tuple<infer F, infer S>
  ? Tuple<F, S>
  : T extends NonEmptyList<infer R>
  ? NonEmptyList<R>
  : T extends EitherAsync<infer L, infer R>
  ? EitherAsync<L, R>
  : T extends MaybeAsync<infer R>
  ? MaybeAsync<R>
  : T

export type InferADTSub<T, R, L = unknown> = T extends Either<unknown, unknown>
  ? Either<L, R>
  : T extends Maybe<unknown>
  ? Maybe<R>
  : T extends Tuple<unknown, unknown>
  ? Tuple<L, R>
  : T extends NonEmptyList<unknown>
  ? NonEmptyList<R>
  : T extends EitherAsync<unknown, unknown>
  ? EitherAsync<L, R>
  : T extends MaybeAsync<unknown>
  ? MaybeAsync<R>
  : T

export type Id<T> = T extends Either<unknown, unknown>
  ? `Either`
  : T extends Maybe<unknown>
  ? `Maybe`
  : T extends Tuple<unknown, unknown>
  ? `Tuple`
  : T extends NonEmptyList<unknown>
  ? `NonEmptyList`
  : T extends EitherAsync<unknown, unknown>
  ? `EitherAsync`
  : T extends MaybeAsync<unknown>
  ? `MaybeAsync`
  : keyof T

export type NestedSameADT<T> = T extends ADT<infer U, infer L>
  ? Id<U> extends Id<T>
    ? T
    : never
  : never

// deno-lint-ignore no-explicit-any
export type Any = any
