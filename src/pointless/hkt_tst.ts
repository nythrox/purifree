import { pipe } from './function-utils'

export interface HKT<F, A> {
  _URI: F
  _A: A
}
export interface URI2HKT<A> {}

export type URIS = keyof URI2HKT<any>
export type Type<URI extends URIS, A> = URI2HKT<A>[URI]

export type Type$<URI extends URIS, A extends any[]> = URI2HKT<A>[URI]
export type URI2HKT$<Types extends any[]>= {
    List: List<Types[0]>[]
    Option: Option<Types[0]>
}
export interface URI2HKT<A> {
  List: List<A>
  Option: Option<A> // maps the type literal "Option" to the type `Option`
}
class List<A> {
  readonly _URI!: 'List'
  readonly _A!: A

  map<B>(f: (a: A) => B): List<B> {
    return 0 as any
  }

  chain<B>(f: (a: A) => List<B>): List<B> {
    return 0 as any
  }
}
const list = <T>(..._args: T[]) => new List<T>()
export interface Functor1<F extends URIS> {
  map: <A, B>(f: (a: A) => B, fa: Type<F, A>) => Type<F, B>
}

export const OPTION_URI = 'Option'

export type OPTION_URI = typeof OPTION_URI

export class None<A> {
  readonly _URI!: OPTION_URI
  readonly _A!: never
  readonly tag: 'None' = 'None'
  map<B>(f: (a: A) => B): Option<B> {
    return none
  }

  chain<B>(f: (a: A) => Option<B>): Option<B> {
    return none
  }

  [Symbol.iterator]: () => Iterator<
    None<A>,
    A,
    { value?: A; returnSelf: boolean } | undefined
  > = 0 as any
}

export class Some<A> {
  readonly _URI!: OPTION_URI
  readonly _A!: A
  readonly tag: 'Some' = 'Some'
  constructor(readonly value: A) {}
  map<B>(f: (a: A) => B): Option<B> {
    return some(f(this.value))
  }

  chain<B>(f: (a: A) => Option<B>): Option<B> {
    return 0 as any
  }

  [Symbol.iterator]: () => Iterator<
    Some<A>,
    A,
    { value?: A; returnSelf: boolean } | undefined
  > = 0 as any
}

export type Option<A> = None<A> | Some<A>

export const none: Option<never> = new None()

export const some = <A>(a: A): Option<A> => {
  return new Some(a)
}
const mapO = <A, B>(f: (a: A) => B, fa: Option<A>) => {
  return fa.map(f)
}

interface FunctorKind<F extends URIS, A> extends HKT<F, A> {
  readonly map: <B>(f: (a: A) => B) => Type<F, B>
}
interface MonadKind<F extends URIS, A> extends FunctorKind<F, A> {
  readonly chain: <B>(f: (a: A) => Type<F, B>) => Type<F, B>
}
interface GeneratableKind<F extends URIS, A> extends MonadKind<F, A> {
  [Symbol.iterator]: () => Iterator<
    Type<F, A>,
    A,
    { value?: A; returnSelf: boolean } | undefined
  >
}
const map = <Functor extends FunctorKind<any, any>, B = any>(
  f: (a: Functor['_A']) => B
) => (fa: Functor): Type<Functor['_URI'], B> => {
  return fa.map(f)
}

const chain = <Monad extends MonadKind<any, any>, B = any>(
  f: (a: Monad['_A']) => MonadKind<Monad['_URI'], B>
) => (fa: Monad): Type<Monad['_URI'], B> => {
  return fa.map(f)
}

export const option: Functor1<OPTION_URI> = {
  map: mapO
}

type hz = Type<'Option', number>
type sla = hz['_URI']
const x = mapO((n) => n * 2, some(1))

function Do<URI extends URIS, R = any>(
  fun: () => Generator<GeneratableKind<URI, any>, R, any>
): Type<URI, R> {
  return null as any
}

const v = Do(function* () {
  const h = yield* some(0)
  return 'jasno'
})

const vv = pipe(
  some(0),
  chain((n) => some('jasno'))
)

const x1 = pipe(
  some(1),
  map((n) => n * 2)
)

type test = None<number> extends FunctorKind<'Option', number> ? true : false
type h = Type<'Option', 'a'>['_A']
