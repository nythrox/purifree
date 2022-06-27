import { ADT, Any, AsyncADT, InferInner } from './types.ts';

export interface OrDefaultable {
  readonly orDefault: (defaultValue: Any) => Any;
}

export function orDefault<T extends OrDefaultable & ADT<unknown, unknown>>(
  defaultValue: InferInner<T>[0],
) {
  return (
    fa: T,
  ): T extends AsyncADT<unknown, unknown> ? Promise<InferInner<T>[0]>
    : InferInner<T>[0] => {
    return fa.orDefault(defaultValue);
  };
}
