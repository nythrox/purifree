import { InferInner, Any, InferADTSub } from './types.ts'

export interface MapLeft {
  mapLeft: (f: (a: unknown) => unknown) => Any
}
export function mapLeft<T extends MapLeft, U>(
  f: (a: InferInner<T>[1]) => U
): (fa: T) => InferADTSub<T, InferInner<T>[0], U> {
  return (fa) => fa.mapLeft(f)
}
