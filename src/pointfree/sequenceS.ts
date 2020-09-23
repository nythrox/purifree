import { Any } from 'ts-toolbelt'
import { Either, Just, Maybe, Right, string } from '..'
import { List } from '../List'
import { ofAp } from '../NonEmptyList'
import { ApKind } from './ap'
import { IsUnion } from './do'
import { ReplaceFirst, Type } from './hkt_tst'

export type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R
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
    : EnforceNonEmptyRecord<NER>
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
  const res = entries.reduce(
    (prev, [key, value]) => prev.ap(add(key)).ap(value),
    newObj
  )
  return res as any
}
export const sequenceSFlex = <Of extends ofAp<any>>(of: Of) => <
  Ap extends ApKind<any, any> = ReturnType<Of>,
  NER extends Record<string, Ap> = any,
  A extends any[] = (NER extends Record<string, infer A> ? A : never)['_A']
>(
  r: EnforceNonEmptyRecord<NER>
): Type<
  Ap['_URI'],
  ReplaceFirst<
    A,
    {
      [K in keyof NER]: NER[K] extends ApKind<any, infer A> ? A[0] : never
    }
  >
> => {
  return Any
}

const resultFlex = sequenceSFlex(Either.of)({
  name: Right<string, Error>('jason'),
  age: Right<number, string>(100)
})
const result = sequenceS(Either.of)({
  name: Right<string, string>('jason'),
  age: Right<number, string>(100)
})

type r = { jason: 0; hello: '' } & Record<string, number>
type hoi = r[string]
