import { ApKind } from '../ap.ts'
import { Any, SyncADT, Id, InferADTSub, InferInner } from '../types.ts'

type Ap<T> = SyncADT<T, Any> & ApKind

export const lift3C =
  <F extends (a: Any) => (b: Any) => (C: Any) => Any>(f: F) =>
  <A extends Ap<Parameters<F>[0]>>(a: A) =>
  <B extends Ap<Parameters<ReturnType<F>>[0]>>(
    b: Id<B> extends Id<A> ? B : never
  ) =>
  <C extends Ap<Parameters<ReturnType<ReturnType<F>>>[0]>>(
    c: Id<C> extends Id<A> ? C : never
  ) => {
    return c.ap(b.ap(a.map(f))) as InferADTSub<
      A,
      ReturnType<F>,
      InferInner<A>[1] | InferInner<B>[1] | InferInner<C>[1]
    >
  }
