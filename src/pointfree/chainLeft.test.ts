import { pipe } from '..'
import { Left, Right } from '../Either'
import { chainLeft } from './chainLeft'

describe('chainLeft', () => {
  it('should not apply the map', () => {
    const num = Right(0)
    const result = pipe(
      num,
      chainLeft(() => Left(new Error('this will not happen')))
    )
    expect(result).toEqual(Right(0))
  })
  it('should apply the map', () => {
    const err = Left<Error, number>(Error(""))
    const result = pipe(
      err,
      chainLeft((err) => Right(err.message.length))
    )
    expect(result).toEqual(Right(0))
  })
})
