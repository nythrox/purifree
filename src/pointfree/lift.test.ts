import { lift2C, lift4C, Right } from '..'
import { Left } from '../Either'
describe('lift', () => {
  test('lift2', () => {
    const add = (a: number) => (b: number) => a + b
    const addL = lift2C(add)
    const addFiveOption = addL(Right<number, any>(5))
    expect(addFiveOption(Right(10))).toEqual(Right(15))
    expect(addFiveOption(Left('error'))).toEqual(Left('Error'))
  })
  test('lift4', () => {
    const something = lift4C(
      (a: string) => (b: number) => (c: boolean) => (d: number) => a + b + c + d
    )
    expect(something(Right('10'))(Right(10))(Right(true))(Right(10))).toEqual(
      Right('10' + 10 + true + 10)
    )
    expect(
      something(Right<string, any>('10'))(Left('err'))(Right(true))(Right(10))
    ).toEqual(Left('err'))
  })
})
