import { MaybeAsync } from './MaybeAsync'
import { Just, Nothing } from './Maybe'
import { Left, Right } from './Either'

describe('MaybeAsync', () => {
  test('fantasy-land', () => {
    expect(MaybeAsync(async () => {}).constructor).toEqual(MaybeAsync)
  })

  test('liftMaybe', () => {
    MaybeAsync(async ({ liftMaybe }) => {
      const _: 5 = await liftMaybe(Just<5>(5))
    })
  })

  test('fromPromise', () => {
    MaybeAsync(async ({ fromPromise }) => {
      const _: 5 = await fromPromise(Promise.resolve(Just<5>(5)))
    })
  })

  test('try/catch', async () => {
    const ma = MaybeAsync(async ({ fromPromise }) => {
      try {
        await fromPromise(Promise.reject('shouldnt show'))
      } catch {
        throw 5
      }
    })

    expect(await ma.run()).toEqual(Nothing)
  })

  test('Promise compatibility', async () => {
    const result = await MaybeAsync(() => {
      throw 'Err'
    })

    const result2 = await MaybeAsync(async () => {
      return 'A'
    })

    expect(result).toEqual(Nothing)
    expect(result2).toEqual(Just('A'))
  })

  test('map', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).map((_) => 'val')
    const newMaybeAsync2 = MaybeAsync(() => Promise.resolve(5))[
      'fantasy-land/map'
    ]((_) => 'val')

    expect(await newMaybeAsync.run()).toEqual(Just('val'))
    expect(await newMaybeAsync2.run()).toEqual(Just('val'))
  })

  test('chain', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).chain((_) =>
      MaybeAsync(() => Promise.resolve('val'))
    )
    const newMaybeAsync2 = MaybeAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => MaybeAsync(() => Promise.resolve('val')))

    expect(await newMaybeAsync.run()).toEqual(Just('val'))
    expect(await newMaybeAsync2.run()).toEqual(Just('val'))
  })

  test('chain (with PromiseLike)', async () => {
    const newMaybeAsync = MaybeAsync(() => Promise.resolve(5)).chain((_) =>
      MaybeAsync.liftMaybe(Just('val'))
    )
    const newMaybeAsync2 = MaybeAsync(() => Promise.resolve(5))[
      'fantasy-land/chain'
    ]((_) => Promise.resolve(Just('val')))

    expect(await newMaybeAsync.run()).toEqual(Just('val'))
    expect(await newMaybeAsync2.run()).toEqual(Just('val'))
  })

  test('toEitherAsync', async () => {
    const ma = MaybeAsync(({ liftMaybe }) => liftMaybe(Nothing))

    expect(await ma.toEitherAsync('Error').run()).toEqual(Left('Error'))

    const ma2 = MaybeAsync(({ liftMaybe }) => liftMaybe(Just(5)))

    expect(await ma2.toEitherAsync('Error').run()).toEqual(Right(5))
  })

  test('ifJust', async () => {
    let a = 0
    await MaybeAsync.liftMaybe(Just(5)).ifJust(() => {
      a = 5
    })
    expect(a).toEqual(5)

    let b = 0
    await MaybeAsync.liftMaybe(Nothing).ifJust(() => {
      b = 5
    })
    expect(b).toEqual(0)
  })

  test('ifNothing', async () => {
    let a = 0
    await MaybeAsync.liftMaybe(Just(5)).ifNothing(() => {
      a = 5
    })
    expect(a).toEqual(0)

    let b = 0
    await MaybeAsync.liftMaybe(Nothing).ifNothing(() => {
      b = 5
    })
    expect(b).toEqual(5)
  })

  describe('run', () => {
    it('resolves to Nothing if any of the async Maybes are Nothing', async () => {
      expect(
        await MaybeAsync(({ liftMaybe }) => liftMaybe(Nothing)).run()
      ).toEqual(Nothing)
    })

    it('resolves to Nothing if there is a rejected promise', async () => {
      expect(await MaybeAsync(() => Promise.reject()).run()).toEqual(Nothing)
    })

    it('resolves to Nothing if there is an exception thrown', async () => {
      expect(
        await MaybeAsync(() => {
          throw new Error('!')
        }).run()
      ).toEqual(Nothing)
    })

    it('resolve to Just if the promise resolves successfully', async () => {
      expect(
        await MaybeAsync(({ fromPromise }) =>
          fromPromise(Promise.resolve(Just(5)))
        ).run()
      ).toEqual(Just(5))
    })
  })

  test('fromPromise static', async () => {
    expect(
      await MaybeAsync.fromPromise(() => Promise.resolve(Just(5))).run()
    ).toEqual(Just(5))
    expect(await MaybeAsync.fromPromise(() => Promise.reject()).run()).toEqual(
      Nothing
    )
  })

  test('liftPromise static', async () => {
    expect(
      await MaybeAsync.fromPromise(() => Promise.resolve(Just(5))).run()
    ).toEqual(Just(5))
    expect(await MaybeAsync.fromPromise(() => Promise.reject()).run()).toEqual(
      Nothing
    )
  })

  test('liftEither static', async () => {
    expect(await MaybeAsync.liftMaybe(Just(5)).run()).toEqual(Just(5))
    expect(await MaybeAsync.liftMaybe(Nothing).run()).toEqual(Nothing)
  })
})
