import { ApKind } from '../ap.ts'
import { Any, SyncADT, Id, InferADTSub, InferInner } from '../types.ts'

type Ap<T> = SyncADT<T, Any> & ApKind

export const lift2C =
  <F extends (a: Any) => (b: Any) => Any>(f: F) =>
  <A extends Ap<Parameters<F>[0]>>(a: A) =>
  <B extends Ap<Parameters<ReturnType<F>>[0]>>(
    b: Id<B> extends Id<A> ? B : never
  ) => {
    return b.ap(a.map(f)) as InferADTSub<
      A,
      ReturnType<ReturnType<F>>,
      InferInner<A>[1] | InferInner<B>[1]
    >
  }
