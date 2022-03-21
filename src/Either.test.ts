import { Either, Left, Right } from './Either'
import { NonEmptyList } from './NonEmptyList'
import { sequenceT } from './pointfree'

describe('Either', () => {
  test('sequence', () => {
    const sequenceTTest = sequenceT(Either.of)(
      Right(2),
      Right('name'),
      Right(true)
    )
    expect(sequenceTTest).toEqual(Right([2, 'name', true]))
    expect(Left(Error()).constructor).toEqual(Either)
    expect(Right(5).constructor).toEqual(Either)

    const sequenceTest2 = Right(NonEmptyList(1, 2)).sequence(NonEmptyList)
    expect(sequenceTest2).toEqual([Right(1), Right(2)])
  })
})
