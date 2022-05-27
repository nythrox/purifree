import { EitherAsync } from './EitherAsync'
import { Left, Right, Either } from './Either'
import { Nothing, Just } from './Maybe'
import { Do } from './pointfree/do'
import { kleisli } from './pointfree/kleisli'
describe('EitherAsync', () => {
  // test('Kleisli', () => {
  //   const getNameTest = kleisli(
  //     (name: string) => Just(name.toUpperCase()),
  //     (_name) => Just(5),
  //     (_name) => Just(5),
  //     (_smh) => Nothing
  //   )
  //   const result = getNameTest('jason')
  //   console.log(result)
  // })
  test('Do', async () => {
    const do1 = Do(function* () {
      const num1 = yield* EitherAsync.of(10)
      const num2 = yield* EitherAsync.of(5)
      return num1 + num2
    })
    const do2 = Do(function* () {
      const name = yield* EitherAsync.liftEither(Left(Error('error!')))
      return name
    })
    const result = Do(function* () {
      const number = yield* do1
      const name = yield* do2
      return {
        number,
        name
      }
    })
    expect(await result).toEqual(Left(10))
  })
  test('fantasy-land', () => {
    expect(EitherAsync(async () => {}).constructor).toEqual(EitherAsync)
  })

  test('liftEither', () => {
    EitherAsync(async ({ liftEither }) => {
      const value: 5 = await liftEither(Right<5>(5))
    })
  })

  test('fromPromise', () => {
    EitherAsync(async ({ fromPromise }) => {
      const value: 5 = await fromPromise(Promise.resolve(Right<5>(5)))
    })
  })

  test('throwE', async () => {
    const ea = EitherAsync<string, number>(async ({ liftEither, throwE }) => {
      const value: 5 = await liftEither(Right<5>(5))
      throwE('Test')
      return value
    })

    expect(await ea.run()).toEqual(Left('Test'))
  })

  test('try/catch', async () => {
    const ea = EitherAsync<string, void>(async ({ fromPromise, throwE }) => {
      try {
        await fromPromise(Promise.reject('shouldnt show'))
      } catch {
        throwE('should show')
      }
    })

    expect(await ea.run()).toEqual(Left('should show'))
  })

  test('Promise compatibility', async () => {
    const result = await EitherAsync<string, never>(() => {
      throw 'Err'
    })

    const result2 = await EitherAsync<never, string>(async () => {
      return 'A'
    })

    expect(result).toEqual(Left('Err'))
    expect(result2).toEqual(Right('A'))
  })

  test('bimap', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).bimap(
      (_) => 'left',
      (_) => 'right'
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/bimap'
    ](
      (_) => 'left',
      (_) => 'right'
    )
    const newEitherAsync3 = EitherAsync(() => {
      throw ''
    }).bimap(
      (_) => 'left',
      (_) => 'right'
    )
    const newEitherAsync4 = EitherAsync(() => {
      throw ''
    })['fantasy-land/bimap'](
      (_) => 'left',
      (_) => 'right'
    )

    expect(await newEitherAsync.run()).toEqual(Right('right'))
    expect(await newEitherAsync2.run()).toEqual(Right('right'))
    expect(await newEitherAsync3.run()).toEqual(Left('left'))
    expect(await newEitherAsync4.run()).toEqual(Left('left'))
  })

  test('map', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).map(
      (_) => 'val'
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/map'
    ]((_) => 'val')

    expect(await newEitherAsync.run()).toEqual(Right('val'))
    expect(await newEitherAsync2.run()).toEqual(Right('val'))
  })

  test('mapLeft', async () => {
    const newEitherAsync = EitherAsync<number, never>(() =>
      Promise.reject(0)
    ).mapLeft((x) => x + 1)

    const newEitherAsync2 = EitherAsync<never, number>(() =>
      Promise.resolve(0)
    ).mapLeft((x) => x + 1)

    expect(await newEitherAsync.run()).toEqual(Left(1))
    expect(await newEitherAsync2.run()).toEqual(Right(0))
  })

  test('chain', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).chain((_) =>
      EitherAsync(() => Promise.resolve('val'))
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => EitherAsync(() => Promise.resolve('val')))

    expect(await newEitherAsync.run()).toEqual(Right('val'))
    expect(await newEitherAsync2.run()).toEqual(Right('val'))
  })

  test('chain (with PromiseLike)', async () => {
    const newEitherAsync = EitherAsync(() => Promise.resolve(5)).chain((_) =>
      EitherAsync.liftEither(Right('val'))
    )
    const newEitherAsync2 = EitherAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => EitherAsync.liftEither(Right('val')))

    expect(await newEitherAsync.run()).toEqual(Right('val'))
    expect(await newEitherAsync2.run()).toEqual(Right('val'))
  })

  test('chainLeft', async () => {
    const newEitherAsync = EitherAsync(() =>
      Promise.resolve(5)
    ).chainLeft((_) => EitherAsync(() => Promise.resolve(7)))
    const newEitherAsync2 = EitherAsync<number, number>(() =>
      Promise.reject(5)
    ).chainLeft((e) => EitherAsync(() => Promise.resolve(e + 1)))

    expect(await newEitherAsync.run()).toEqual(Right(5))
    expect(await newEitherAsync2.run()).toEqual(Right(6))
  })

  test('chainLeft (with PromiseLike)', async () => {
    const newEitherAsync = EitherAsync(() =>
      Promise.resolve(5)
    ).chainLeft((_) => EitherAsync.liftEither(Right(7)))
    const newEitherAsync2 = EitherAsync<number, number>(() =>
      Promise.reject(5)
    ).chainLeft((e) => EitherAsync.liftEither(Right(e + 1)))

    expect(await newEitherAsync.run()).toEqual(Right(5))
    expect(await newEitherAsync2.run()).toEqual(Right(6))
  })

  test('toMaybeAsync', async () => {
    const ma = EitherAsync(({ liftEither }) => liftEither(Left('123')))

    expect(await ma.toMaybeAsync().run()).toEqual(Nothing)

    const ma2 = EitherAsync(({ liftEither }) => liftEither(Right(5)))

    expect(await ma2.toMaybeAsync().run()).toEqual(Just(5))
  })

  test('swap', async () => {
    const eitherAsyncRight = EitherAsync(() => Promise.resolve(5))
    expect(await eitherAsyncRight.swap().run()).toEqual(Left(5))

    const eitherAsyncLeft = EitherAsync(async () => Promise.reject('fail'))
    expect(await eitherAsyncLeft.swap().run()).toEqual(Right('fail'))
  })

  test('ifLeft', async () => {
    let a = 0
    await EitherAsync.liftEither(Left('Error')).ifLeft(() => {
      a = 5
    })
    expect(a).toEqual(5)

    let b = 0
    await EitherAsync.liftEither(Right(5)).ifLeft(() => {
      b = 5
    })
    expect(b).toEqual(0)
  })

  test('ifRight', async () => {
    let a = 0
    await EitherAsync.liftEither(Left('Error')).ifRight(() => {
      a = 5
    })
    expect(a).toEqual(0)

    let b = 0
    await EitherAsync.liftEither(Right(5)).ifRight(() => {
      b = 5
    })
    expect(b).toEqual(5)
  })

  describe('run', () => {
    it('resolves to Left if any of the async Eithers are Left', async () => {
      expect(
        await EitherAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Left('Error')))
        ).run()
      ).toEqual(Left('Error'))
    })

    it('resolves to a Left with the rejected value if there is a rejected promise', async () => {
      expect(
        await EitherAsync<void, never>(({ fromPromise }) =>
          fromPromise(Promise.reject('Some error'))
        ).run()
      ).toEqual(Left('Some error'))
    })

    it('resolves to Left with an exception if there is an exception thrown', async () => {
      expect(
        await EitherAsync(() => {
          throw new Error('!')
        }).run()
      ).toEqual(Left(Error('!')))
    })

    it('resolve to Right if the promise resolves successfully', async () => {
      expect(
        await EitherAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Right(5)))
        ).run()
      ).toEqual(Right(5))
    })
  })

  test('fromPromise static', async () => {
    expect(
      await EitherAsync.fromPromise(() => Promise.resolve(Right(5))).run()
    ).toEqual(Right(5))
    expect(
      await EitherAsync.fromPromise(() => Promise.reject(5)).run()
    ).toEqual(Left(5))
  })

  test('liftPromise static', async () => {
    expect(
      await EitherAsync.liftPromise(() => Promise.resolve(5)).run()
    ).toEqual(Right(5))
    expect(
      await EitherAsync.liftPromise(() => Promise.reject(5)).run()
    ).toEqual(Left(5))
  })

  test('liftEither static', async () => {
    expect(await EitherAsync.liftEither(Right(5)).run()).toEqual(Right(5))
    expect(await EitherAsync.liftEither(Left(5)).run()).toEqual(Left(5))
  })

  test('lefts', async () => {
    expect(
      await EitherAsync.lefts([
        EitherAsync.liftEither(Left('Error')),
        EitherAsync.liftEither(Left('Error2')),
        EitherAsync.liftEither(Right(5))
      ])
    ).toEqual(['Error', 'Error2'])
  })

  test('rights', async () => {
    expect(
      await EitherAsync.rights([
        EitherAsync.liftEither(Right(10)),
        EitherAsync.liftEither(Left('Error')),
        EitherAsync.liftEither(Right(5))
      ])
    ).toEqual([10, 5])
  })

  test('sequence', async () => {
    expect(await EitherAsync.sequence([])).toEqual(Right([]))

    const uncalledFn = jest.fn()

    expect(
      await EitherAsync.sequence([
        EitherAsync(
          () =>
            new Promise((_, reject) => {
              setTimeout(() => {
                reject('A')
              }, 200)
            })
        ),
        EitherAsync(uncalledFn)
      ])
    ).toEqual(Left('A'))

    expect(uncalledFn).toHaveBeenCalledTimes(0)

    const calledFn = jest.fn()

    expect(
      await EitherAsync.sequence([
        EitherAsync.liftEither(Right(1)),
        EitherAsync(async () => {
          calledFn()
          return 2
        })
      ])
    ).toEqual(Right([1, 2]))

    expect(calledFn).toHaveBeenCalledTimes(1)
  })
  test('finally', async () => {
    let a = 0
    await EitherAsync.liftEither(Left('Error')).finally(() => {
      a = 5
    })
    expect(a).toEqual(5)

    let b = 0
    await EitherAsync.liftEither(Right(5)).finally(() => {
      b = 5
    })
    expect(b).toEqual(5)
  })
})
