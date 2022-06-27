import { pipe } from '../utils/function-utils.ts'
import { Left, Right } from 'purify'
import { chainLeft } from './chainLeft.ts'
import { assertEquals } from 'deno_asserts'
import { describe, it } from 'deno_bdd'

describe('chainLeft', () => {
  it('should not apply the map', () => {
    const num = Right(0)
    const result = pipe(
      num,
      chainLeft(() => Left(new Error('this will not happen')))
    )
    assertEquals(result, Right(0))
  })
  it('should apply the map', () => {
    const err = Left<Error, number>(Error(''))
    const result = pipe(
      err,
      chainLeft((err) => Right(err.message.length))
    )
    assertEquals(result, Right(0))
  })
})
