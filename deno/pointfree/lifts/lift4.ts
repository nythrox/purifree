import { ApKind } from '../ap.ts'
import { Any, SyncADT, Id, InferADTSub, InferInner } from '../types.ts'

type Ap<T> = SyncADT<T, Any> & ApKind

export const lift4 =
  <F extends (a: Any, b: Any, C: Any, D: Any) => Any>(f: F) =>
  <A extends Ap<Parameters<F>[0]>>(a: A) =>
  <B extends Ap<Parameters<F>[1]>>(b: Id<B> extends Id<A> ? B : never) =>
  <C extends Ap<Parameters<F>[2]>>(c: Id<C> extends Id<A> ? C : never) =>
  <D extends Ap<Parameters<F>[3]>>(d: Id<D> extends Id<A> ? D : never) => {
    const fn =
      (a: Parameters<F>[0]) =>
      (b: Parameters<F>[1]) =>
      (c: Parameters<F>[2]) =>
      (d: Parameters<F>[3]) =>
        f(a, b, c, d)
    return d.ap(c.ap(b.ap(a.map(fn)))) as InferADTSub<
      A,
      ReturnType<F>,
      InferInner<A>[1] | InferInner<B>[1] | InferInner<C>[1] | InferInner<D>[1]
    >
  }
