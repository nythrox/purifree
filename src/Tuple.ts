import { Tuple } from 'purify-ts'

export const TUPLE_URI = 'Tuple'
export type TUPLE_URI = typeof TUPLE_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [TUPLE_URI]: Tuple<Types[1], Types[0]>
  }
}

declare module 'purify-ts' {
  interface Tuple<F, S> {
    readonly _URI: TUPLE_URI
    readonly _A: [S, F]
  }
}

export * from 'purify-ts/Tuple'
