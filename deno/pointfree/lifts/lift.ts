import { Any, InferADTSub, InferInner, SyncADT } from '../types.ts';

type Ap<T> = SyncADT<T, Any>;

export const lift = <F extends (a: Any) => Any>(f: F) =>
  <A extends Ap<Parameters<F>[0]>>(a: A) => {
    return a.map(f) as InferADTSub<A, ReturnType<F>, InferInner<A>[1]>;
  };
