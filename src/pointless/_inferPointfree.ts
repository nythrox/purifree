import { NoInfer } from 'Function/_api'
import { A, Any, F } from 'ts-toolbelt'
import { Either, Maybe, Right } from '..'
// const makePointFree = <
//   Object extends HKT<any, any>,
//   name extends string ,
//   Type extends { [P in name]: (...args: any[]) => any } = TypeFromHKT<
//     Object,
//     []
//   >,
//   Function extends (...args: any[]) => any = Type[name],
//   Params extends any[] = Parameters<Function>,
//   Return = ReturnType<Function>
// >(
//   name: name
// ): ((...args: Params) => (object: Type) => Return) => {
//   return (...args) => (object) => object[name](...args)

import { pipe } from './function-utils'

// }
type changeReturnType<F extends (...args: any) => any, R> = Any.Cast<
  (...args: Parameters<F>) => R,
  any
>
type test = changeReturnType<
  Maybe<number>['chain'],
  (obj: Maybe<number>) => any
>
const makePointFreeBetter = <name extends string>(name: name) => {
  return <Object extends { [P in name]: (...args: any[]) => any }>(
    obj: Object
  ): Object[name] =>
    ((...args: any[]) => {
      return (obj as any)[name](...args)
    }) as any
  // => (...args: Params): Return => {
  //   return (obj as any)[name](...args)
  // }
  // (
  //   ...args: Params
  // ) => (obj: Object): Return => {
  //   return (obj as any)[name](...args)
  // }
}

type please<
  Object extends object,
  T extends (...args: any[]) => any
> = T extends infer Function ? (object: Object) => Function : never
type tttest = please<{ name: 'jason' }, <T, T2>(t: T) => T2>
type t1 = ((num: string) => number) & ((...args: any) => any)
const t1: t1 = 0 as any
const r1 = t1('asd')
type fn = <T>(val: T) => T

// function appy<
//   R,
//   T extends (...args: any[]) => R,
//   Args extends Parameters<T> = Parameters<T>
// >(fn: T & ((...args: any[]) => R), ...args: Args) {
//   const v = fn(...args)
//   return v as R
// }
// const sla234 = appy(Right(0)['chain'], (num) => Right(10))
// type apply<T extends (...args: any[]) => any, params extends Parameters<T>> = T
// type applym = typeof appy
// type hoi = apply<fn, [5]>

type PontFreeFunction<name extends string> = <
  Object extends { [P in name]: (...args: any[]) => any }
>(
  // ...args: F.NoInfer<Parameters<Object[name]>>
  ...args: Parameters<Object[name]>
) => (obj: Object) => ReturnType<Object[name]>

type PontFreeFunction2<name extends string> = <
  Object extends { [P in name]: (...args: any[]) => any }
>(
  // ...args: F.NoInfer<Parameters<Object[name]>>
  ...args: Parameters<Object[name]>
) => <F extends (...args: any[]) => any = Object[name]>(
  obj: Object
) => {
  f: Object[name]
  res: F extends infer U
    ? [U extends (...args: any[]) => infer R ? R : never][U extends any
        ? 0
        : never]
    : never
}
const any = undefined as any
type myfn = PontFreeFunction2<'chain'>
const ccchain: myfn = any

const test0 = pipe(
  Right(10),
  ccchain((value) => Right(value))
)

const makePointFree2 = <name extends string>(name: name) => {
  return <Object extends { [P in name]: (...args: any[]) => any }>(
    ...args: Parameters<Object[name]>
  ) => (obj: Object) => {
    let f = (obj[name] as unknown) as Object[name]
    let res = (false as true) && f(...args) // problem: it calculates `res` NOW, instead of only when the function is called. You can put this in a type declaration to calculate it LATER, but in a type declaration you can't call a function.
    return any as typeof res extends infer A ? A : never
  }
}
const makePointFree = function <name extends string>(name: name) {
  return any as PontFreeFunction<name>
}

const inferChain1 = makePointFree('chain')
const inferChain2 = makePointFree2('chain')
const inferChain3 = makePointFreeBetter('chain')
const test1 = pipe(
  Right(10),
  inferChain1((value) => Right(value))
)
const test2 = inferChain3(Right(0))((num) => Right(num))
const hi = pipe(
  Right(0),
  inferChain2((num) => Right(0))
)

const toString = makePointFree('toString')
const valueOf = makePointFree('valueOf')
const map = makePointFree('map') // gets <unkown> because of generics :(
const v = pipe(0, toString(), valueOf())
