import { ApKind } from '../ap.ts';
import { Any, Id, InferADTSub, InferInner, SyncADT } from '../types.ts';

type Ap<T> = SyncADT<T, Any> & ApKind;

export const lift3 = <F extends (a: Any, b: Any, C: Any) => Any>(f: F) =>
  <A extends Ap<Parameters<F>[0]>>(a: A) =>
    <B extends Ap<Parameters<F>[1]>>(b: Id<B> extends Id<A> ? B : never) =>
      <C extends Ap<Parameters<F>[2]>>(c: Id<C> extends Id<A> ? C : never) => {
        const fn = (a: Parameters<F>[0]) =>
          (b: Parameters<F>[1]) => (c: Parameters<F>[2]) => f(a, b, c);
        return c.ap(b.ap(a.map(fn))) as InferADTSub<
          A,
          ReturnType<F>,
          InferInner<A>[1] | InferInner<B>[1] | InferInner<C>[1]
        >;
      };
