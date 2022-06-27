import { Left, Right } from 'purify'
import { assertEquals } from 'deno_asserts'
import { describe, it as test } from 'deno_bdd'

import { lift2C, lift4C } from './lifts/mod.ts'

describe('lift', () => {
  test('lift2', () => {
    const add = (a: number) => (b: number) => a + b
    const addL = lift2C(add)
    const addFiveOption = addL(Right(5))
    assertEquals(addFiveOption(Right(10)), Right(15))
    assertEquals(addFiveOption(Left('error')), Left('error'))
  })
  test('lift4', () => {
    const something = lift4C(
      (a: string) => (b: number) => (c: boolean) => (d: number) => a + b + c + d
    )
    assertEquals(
      something(Right('10'))(Right(10))(Right(true))(Right(10)),
      Right('10' + 10 + true + 10)
    )
    assertEquals(
      something(Right('10'))(Left('err'))(Right(true))(Right(10)),
      Left('err')
    )
  })
})
