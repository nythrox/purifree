import {
  Maybe,
  Either,
  EitherAsync,
  MaybeAsync,
  Tuple,
  NonEmptyList
} from 'purify'

export type Eithers<L, R> = Either<L, R> | EitherAsync<L, R>
export type Maybes<T> = Maybe<T> | MaybeAsync<T>

export type ADT<R, L> = Eithers<L, R> | Maybes<R> | Tuple<L, R>

export type AsyncADT<R, L> = EitherAsync<L, R> | MaybeAsync<R>
export type SyncADT<R, L> = Either<L, R> | Maybe<R> | Tuple<L, R>
export type ADTInPromiseLike<R, L> =
  | PromiseLike<Either<L, R>>
  | PromiseLike<Maybe<R>>

export type InferInner<T> = T extends
  | ADT<infer R, infer L>
  | ADTInPromiseLike<infer R, infer L>
  ? [R, L]
  : never

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
  ? Either<unknown, unknown>
  : T extends Maybe<unknown>
  ? Maybe<unknown>
  : T extends Tuple<unknown, unknown>
  ? Tuple<unknown, unknown>
  : T extends NonEmptyList<unknown>
  ? NonEmptyList<unknown>
  : T extends EitherAsync<unknown, unknown>
  ? EitherAsync<unknown, unknown>
  : T extends PromiseLike<Either<unknown, unknown>>
  ? EitherAsync<unknown, unknown>
  : T extends MaybeAsync<unknown>
  ? MaybeAsync<unknown>
  : T extends PromiseLike<Maybe<unknown>>
  ? MaybeAsync<unknown>
  : never

// deno-lint-ignore no-explicit-any
export type Any = any
