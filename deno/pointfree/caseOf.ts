import { ADT, Any, Eithers, Maybes, AsyncADT, SyncADT } from './types.ts'
import { EitherPatterns, MaybePatterns } from 'purify'

interface CaseOfable {
  caseOf(pattern: Any): Any
}

type CaseReturnType<T, U> = T extends AsyncADT<unknown, unknown>
  ? Promise<U>
  : T extends SyncADT<unknown, unknown>
  ? U
  : never

type InferPattern<T, U> = T extends Eithers<infer L, infer R>
  ? EitherPatterns<L, R, U>
  : T extends Maybes<infer R>
  ? MaybePatterns<R, U>
  : never

export function caseof<T extends CaseOfable & ADT<unknown, unknown>, U>(
  pattern: InferPattern<T, U>
) {
  return (fa: T): CaseReturnType<T, U> => fa.caseOf(pattern)
}
