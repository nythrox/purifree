import { List } from './List'
import { Just, Nothing } from './Maybe'
import { Tuple } from './Tuple'
import { compare } from './Function'
import { sequenceS } from './pointfree/sequenceS'
import { sequenceT } from './pointfree/sequenceT'
import { Either, Right } from './Either'
import { traverse } from './pointfree/traverse'
import { sequence } from './pointfree/sequence'
import { pipe } from '.'
describe('List', () => {
  test('sequence', () => {
    expect(pipe(List(Right(5)), sequence(Either.of))).toEqual(Right(List(5)))
  })
  test('sequenceT', () => {
    expect(sequenceT(Either.of)(Right(5))).toEqual(Right(List(5)))
  })
  test('sequenceS', () => {
    expect(
      sequenceS(Either.of)({
        name: Right<string, string>('test'),
        something: Right<string, string>('test'),
        age: Right<number, string>(100)
      })
    ).toEqual(
      Right({
        name: 'test',
        something: 'test',
        age: 100
      })
    )
  })
  test('traverse', () => {
    expect(
      pipe(
        List(1, 2),
        traverse(List.of, (num) => List(num, num * 2))
      )
    ).toEqual(List(List(1, 2), List(1, 4), List(2, 2), List(2, 4)))
    expect(
      pipe(
        List(1, 2, 3),
        traverse(Either.of, (num) => Right(num * 5))
      )
    ).toEqual(Right(List(5, 10, 15)))
  })

  test('at', () => {
    expect(List.at(0, [1, 2])).toEqual(Just(1))
    expect(List.at(0)([1, 2])).toEqual(Just(1))
    expect(List.at(0, [1, 2])).toEqual(Just(1))
    expect(List.at(0, [])).toEqual(Nothing)
  })

  test('head', () => {
    expect(List.head([1])).toEqual(Just(1))
    expect(List.head([])).toEqual(Nothing)
  })

  test('last', () => {
    expect(List.last([1, 2, 3])).toEqual(Just(3))
    expect(List.last([])).toEqual(Nothing)
  })

  test('tail', () => {
    expect(List.tail([1, 2, 3])).toEqual(Just([2, 3]))
    expect(List.tail([1])).toEqual(Just([]))
    expect(List.tail([])).toEqual(Nothing)
  })

  test('init', () => {
    expect(List.init([1, 2, 3])).toEqual(Just([1, 2]))
    expect(List.init([1])).toEqual(Just([]))
    expect(List.init([])).toEqual(Nothing)
  })

  test('uncons', () => {
    expect(List.uncons([])).toEqual(Nothing)
    expect(List.uncons([1])).toEqual(Just(Tuple(1, [])))
    expect(List.uncons([1, 2])).toEqual(Just(Tuple(1, [2])))
    expect(List.uncons([1, 2, 3])).toEqual(Just(Tuple(1, [2, 3])))
  })

  test('sum', () => {
    expect(List.sum([])).toEqual(0)
    expect(List.sum([1, 2, 3])).toEqual(6)
  })

  test('find', () => {
    expect(List.find((x) => x == 5)([1, 2, 3, 5])).toEqual(Just(5))
    expect(List.find((x) => x == 5, [1, 2, 3, 5])).toEqual(Just(5))
    expect(List.find((x) => x == 0, [1, 2, 3, 5])).toEqual(Nothing)
  })

  test('findIndex', () => {
    expect(List.findIndex((x) => x == 5)([1, 2, 3, 5])).toEqual(Just(3))
    expect(List.findIndex((x) => x == 5, [1, 2, 3, 5])).toEqual(Just(3))
    expect(List.findIndex((x) => x == 0, [1, 2, 3, 5])).toEqual(Nothing)
  })

  test('sort', () => {
    const arr = [4, 3, 1000, 0]

    expect(List.sort(compare, arr)).toEqual([0, 3, 4, 1000])
    expect(List.sort(compare)(arr)).toEqual([0, 3, 4, 1000])
    // immutability check
    expect(List.sort(compare, arr)).not.toBe(arr)
  })
})
