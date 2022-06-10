import { Either, Left, Right } from './Either'
import { NonEmptyList } from './NonEmptyList'
import { Maybe, Just } from './Maybe'
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

    const sequenceTest2 = Right(NonEmptyList([1, 2])).sequence(NonEmptyList.of)
    expect(sequenceTest2).toEqual([Right(1), Right(2)])
  })

  test('iterator', () => {
    for (const e of Right(5)) {
      expect(e).toEqual(Right(5))
    }
  })
  test('traverse', () => {
    const wrappedwithMaybe = Right(4).traverse(Maybe.of, Just)
    expect(wrappedwithMaybe).toEqual(Just(Right(4)))
  })
})
