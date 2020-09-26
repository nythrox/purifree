import { HKT, ReplaceFirst, Type, URIS } from './hkt'

export interface Joinable<F extends URIS, A extends any[]> extends HKT<F, A> {
  // this is Either<L,Either<any,any>>
  readonly join: <Same extends HKT<F, any>>(
    this: Type<F, ReplaceFirst<A, Same>>
  ) => Type<Same['_URI'], ReplaceFirst<Same['_A'], Type<F, Same['_A'][0]>>>
}

export const join = <
  JoinM extends Joinable<
    any,
    [HKT<JoinM['_URI'], ReplaceFirst<JoinM['_A'], any>>, ...any]
  >,
  Values = JoinM extends HKT<JoinM['_URI'], infer Args> ? Args : never,
  Inner0 = Values extends any[] ? Values[0] : never,
  Inner = Inner0 extends HKT<JoinM['_URI'], infer ApArgs>
    ? HKT<JoinM['_URI'], ApArgs>
    : never
>() => (
  seq: JoinM
): Inner extends HKT<JoinM['_URI'], any>
  ? Type<JoinM['_URI'], ReplaceFirst<JoinM['_A'], Inner['_A'][0]>>
  : never => {
  return seq.join()
}
