import { ApKind, ofAp } from './ap'
import { IsUnion } from './do'
import { ReplaceFirst, Type } from './hkt'

export const sequenceS = <Of extends ofAp<any>>(of: Of) => <
  Ap extends ApKind<any, any> = ReturnType<Of>,
  NER extends Record<string, Ap> = any,
  A extends any[] = (NER extends Record<string, infer A> ? A : never)['_A'],
  Rest = A extends [infer _A, ...infer Rest] ? Rest : never
>(
  r: IsUnion<Rest> extends true
    ? [
        'ERROR: All secondary generics must be of the same type. Different generics found: ',
        Rest
      ]
    : NER
): IsUnion<Rest> extends true
  ? [
      'ERROR: All secondary generics must be of the same type. Different generics found: ',
      Rest
    ]
  : Type<
      Ap['_URI'],
      ReplaceFirst<
        A,
        {
          [K in keyof NER]: NER[K] extends ApKind<any, infer A> ? A[0] : never
        }
      >
    > => {
  const entries = Object.entries(r) as [string, Ap][]
  const newObj = of({})
  const add = (key: string) =>
    of((obj: Record<string, any>) => (value: any) => ((obj[key] = value), obj))
  // prev: Right({}), curr: ["name",Right("jason")]
  // Right({}).ap(add(key)) :: Right((value) => (obj[key]=value,obj))
  // Right({}).app(add(key)).ap(Right("jason")) :: Right({ name: "jason" })
  const res = entries.reduce((prev, [key, value]) => {
    // TODO: better implementation
    const val1 = prev.ap(add(key))
    const val2 = val1.ap(value.map((val) => (f: (val: any) => any) => f(val)))
    return val2
  }, newObj)
  return res as any
}
export const sequenceSFlex = <Of extends ofAp<any>>(of: Of) => <
  Ap extends ApKind<any, any> = ReturnType<Of>,
  NER extends Record<string, Ap> = any,
  A extends any[] = (NER extends Record<string, infer A> ? A : never)['_A']
>(
  r: NER
): Type<
  Ap['_URI'],
  ReplaceFirst<
    A,
    {
      [K in keyof NER]: NER[K] extends ApKind<any, infer A> ? A[0] : never
    }
  >
> => {
  return sequenceS(of)(r as any)
}
