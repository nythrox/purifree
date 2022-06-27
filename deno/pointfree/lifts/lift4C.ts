import { ApKind } from '../ap.ts';
import { Any, Id, InferADTSub, InferInner, SyncADT } from '../types.ts';

type Ap<T> = SyncADT<T, Any> & ApKind;

export function lift4C<F extends (a: Any) => (b: Any) => (C: Any) => Any>(
  f: F,
) {
  return <A extends Ap<Parameters<F>[0]>>(a: A) =>
    <B extends Ap<Parameters<ReturnType<F>>[0]>>(
      b: Id<B> extends Id<A> ? B : never,
    ) =>
      <C extends Ap<Parameters<ReturnType<ReturnType<F>>>[0]>>(
        c: Id<C> extends Id<A> ? C : never,
      ) =>
        <D extends Ap<Parameters<ReturnType<ReturnType<ReturnType<F>>>>[0]>>(
          d: Id<D> extends Id<A> ? D : never,
        ) => {
          return d.ap(c.ap(b.ap(a.map(f)))) as InferADTSub<
            A,
            ReturnType<ReturnType<ReturnType<ReturnType<F>>>>,
            | InferInner<A>[1]
            | InferInner<B>[1]
            | InferInner<C>[1]
            | InferInner<D>[1]
          >;
        };
}
