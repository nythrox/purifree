import { Chainable } from './chain.ts'
import { InferInner, InferADT, Any } from './types.ts'

type InferKFnR<FN extends (...args: Any) => Chainable> = InferADT<
  ReturnType<FN>
>
type InferInnerK<FN extends (...args: Any) => Chainable> = InferInner<
  InferKFnR<FN>
>

export function kleisli<FN extends (...args: Any) => Chainable>(
  a: FN
): (...args: Parameters<FN>) => InferKFnR<FN>

export function kleisli<
  FN extends (...args: Any) => Chainable,
  B extends Chainable
>(
  a: FN,
  b: (arg: InferInnerK<FN>[0]) => B
): (...args: Parameters<FN>) => InferADT<B>

export function kleisli<
  FN extends (...args: Any) => Chainable,
  B extends Chainable,
  C extends Chainable
>(
  a: FN,
  b: (arg: InferInnerK<FN>[0]) => B,
  c: (arg: InferInner<B>[0]) => C
): (...args: Parameters<FN>) => InferADT<C>

export function kleisli<
  FN extends (...args: Any) => Chainable,
  B extends Chainable,
  C extends Chainable,
  D extends Chainable
>(
  a: FN,
  b: (arg: InferInnerK<FN>[0]) => B,
  c: (arg: InferInner<B>[0]) => C,
  d: (arg: InferInner<C>[0]) => D
): (...args: Parameters<FN>) => InferADT<D>

export function kleisli<
  FN extends (...args: Any) => Chainable,
  B extends Chainable,
  C extends Chainable,
  D extends Chainable,
  E extends Chainable
>(
  a: FN,
  b: (arg: InferInnerK<FN>[0]) => B,
  c: (arg: InferInner<B>[0]) => C,
  d: (arg: InferInner<C>[0]) => D,
  e: (arg: InferInner<D>[0]) => E
): (...args: Parameters<FN>) => InferADT<E>

export function kleisli<
  FN extends (...args: Any) => Chainable,
  B extends Chainable,
  C extends Chainable,
  D extends Chainable,
  E extends Chainable,
  F extends Chainable
>(
  a: FN,
  b: (arg: InferInnerK<FN>[0]) => B,
  c: (arg: InferInner<B>[0]) => C,
  d: (arg: InferInner<C>[0]) => D,
  e: (arg: InferInner<D>[0]) => E,
  f: (arg: InferInner<E>[0]) => F
): (...args: Parameters<FN>) => InferADT<F>

export function kleisli<
  FN extends (...args: Any) => Chainable,
  B extends Chainable,
  C extends Chainable,
  D extends Chainable,
  E extends Chainable,
  F extends Chainable,
  G extends Chainable
>(
  a: FN,
  b: (arg: InferInnerK<FN>[0]) => B,
  c: (arg: InferInner<B>[0]) => C,
  d: (arg: InferInner<C>[0]) => D,
  e: (arg: InferInner<D>[0]) => E,
  f: (arg: InferInner<E>[0]) => F,
  g: (arg: InferInner<F>[0]) => G
): (...args: Parameters<FN>) => InferADT<G>

export function kleisli<T extends Array<(...args: Any) => Chainable>>(
  ...fns: T
) {
  return (...args: Parameters<T[0]>): InferADT<ReturnType<T[T['length']]>> => {
    return fns
      .slice(1)
      .reduce(
        (prev, cur) => prev.chain(cur),
        (fns[0] as Any)(...(args as unknown[]))
      )
  }
}
