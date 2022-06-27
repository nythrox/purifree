import { ApKind } from '../ap.ts';
import { Any, Id, InferADTSub, InferInner, SyncADT } from '../types.ts';

type Ap<T> = SyncADT<T, Any> & ApKind;

export const lift2 = <F extends (a: Any, b: Any) => Any>(f: F) =>
  <A extends Ap<Parameters<F>[0]>>(a: A) =>
    <B extends Ap<Parameters<F>[1]>>(b: Id<B> extends Id<A> ? B : never) => {
      const fn = (a: Parameters<F>[0]) => (b: Parameters<F>[1]) => f(a, b);
      return b.ap(a.map(fn)) as InferADTSub<
        A,
        ReturnType<F>,
        InferInner<A>[1] | InferInner<B>[1]
      >;
    };
