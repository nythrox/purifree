import { pipe } from '..'
import { Either, Right } from '../Either'
import { List } from '../List'
import { sequence } from './sequence'
import { sequenceS } from './sequenceS'
import { sequenceT } from './sequenceT'
describe('sequence', () => {
  test('sequenceS empty', () => {
    expect(sequenceS(Either.of)({})).toEqual(Right({}))
  })
  test('sequenceT empty', () => {
    expect(sequenceT(Either.of)()).toEqual(Right([]))
  })
  test('sequence', () => {
    expect(pipe(List(Right(1), Right(5)), sequence(Either.of))).toEqual(
      Right([1, 5])
    )
  })
})
