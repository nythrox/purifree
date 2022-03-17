import { Either, Left, Right } from './Either'
import { MaybeAsync } from './MaybeAsync'
import { ofSymbol } from './pointfree/do'
import { Type } from './pointfree/hkt'

export const EITHER_ASYNC_URI = 'EitherAsync'
export type EITHER_ASYNC_URI = typeof EITHER_ASYNC_URI

declare module './pointfree/hkt' {
  export interface URI2HKT<Types extends any[]> {
    [EITHER_ASYNC_URI]: EitherAsync<Types[1], Types[0]>
  }
}
export interface EitherAsyncTypeRef {
  /** Constructs an `EitherAsync` object from a function that takes an object full of helpers that let you lift things into the `EitherAsync` context and returns a Promise */
  <L, R>(
    runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
  ): EitherAsync<L, R>
  of<L = never, R = any>(value: R): EitherAsync<L, R>
  /** Constructs an `EitherAsync` object from a function that returns an Either wrapped in a Promise */
  fromPromise<L, R>(f: () => PromiseLike<Either<L, R>>): EitherAsync<L, R>
  /** Constructs an `EitherAsync` object from a function that returns a Promise. The left type is defaulted to the built-in Error type */
  liftPromise<R, L = Error>(f: () => PromiseLike<R>): EitherAsync<L, R>
  /** Constructs an `EitherAsync` object from an Either */
  liftEither<L, R>(either: Either<L, R>): EitherAsync<L, R>
  /** Takes a list of `EitherAsync`s and returns a Promise that will resolve with all `Left` values. Internally it uses `Promise.all` to wait for all results */
  lefts<L, R>(list: EitherAsync<L, R>[]): Promise<L[]>
  /** Takes a list of `EitherAsync`s and returns a Promise that will resolve with all `Right` values. Internally it uses `Promise.all` to wait for all results */
  rights<L, R>(list: EitherAsync<L, R>[]): Promise<R[]>
  /** Turns a list of `EitherAsync`s into an `EitherAsync` of list. The returned `Promise` will be rejected as soon as a single `EitherAsync` resolves to a `Left`, it will not wait for all Promises to resolve and since `EitherAsync` is lazy, unlike `Promise`, the remaining async operations will not be executed at all */
  sequence<L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]>
}

export interface EitherAsync<L, R> extends PromiseLike<Either<L, R>> {
  readonly _URI: EITHER_ASYNC_URI
  readonly _A: [R, L]

  [ofSymbol]: EitherAsyncTypeRef['of']
  [Symbol.iterator]: () => Iterator<Type<EITHER_ASYNC_URI, [R, L]>, R, any>

  /**
   * It's important to remember how `run` will behave because in an
   * async context there are other ways for a function to fail other
   * than to return a Nothing, for example:
   * If any of the computations inside EitherAsync resolved to a Left,
   * `run` will return a Promise resolved to that Left.
   * If any of the promises were to be rejected then `run` will return
   * a Promise resolved to a Left with the rejection value inside
   * If an exception is thrown then `run` will return a Promise
   * resolved to a Left with the exception inside
   * If none of the above happen then a promise resolved to the
   * returned value wrapped in a Right will be returned
   */

  run(): Promise<Either<L, R>>
  /** Given two functions, maps the value that the Promise inside `this` resolves to using the first if it is `Left` or using the second one if it is `Right` */
  bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): EitherAsync<L2, R2>
  /** Transforms the `Right` value of `this` with a given function. If the `EitherAsync` that is being mapped resolves to a Left then the mapping function won't be called and `run` will resolve the whole thing to that Left, just like the regular Either#map */
  map<R2>(f: (value: R) => R2): EitherAsync<L, R2>
  /** Maps the `Left` value of `this`, acts like an identity if `this` is `Right` */
  mapLeft<L2>(f: (value: L) => L2): EitherAsync<L2, R>
  /** Transforms `this` with a function that returns a `EitherAsync`. Behaviour is the same as the regular Either#chain */
  chain<R2>(f: (value: R) => EitherAsync<L, R2>): EitherAsync<L, R2>
  /** The same as EitherAsync#chain but executes the transformation function only if the value is Left. Useful for recovering from errors */
  chainLeft<L2>(f: (value: L) => EitherAsync<L2, R>): EitherAsync<L2, R>
  /** Flattens nested Eithers. `e.join()` is equivalent to `e.chain(x => x)` */
  join<R2>(this: EitherAsync<L, EitherAsync<L, R2>>): EitherAsync<L, R2>
  /** Converts `this` to a MaybeAsync, discarding any error values */
  toMaybeAsync(): MaybeAsync<R>
  /** Returns `Right` if `this` is `Left` and vice versa */
  swap(): EitherAsync<R, L>
  /** Runs an effect if `this` is `Left`, returns `this` to make chaining other methods possible */
  ifLeft(effect: (value: L) => any): EitherAsync<L, R>
  /** Runs an effect if `this` is `Right`, returns `this` to make chaining other methods possible */
  ifRight(effect: (value: R) => any): EitherAsync<L, R>
  /** Applies a `Right` function over a future `Right` value. Returns `Left` if either the future value of `this` or the function are `Left` */
  ap<R2>(other: EitherAsync<L, (value: R) => R2>): EitherAsync<L, R2>
  /** Returns the first `Right` between the future value of `this` and another future `Either` or the `Left` in the argument if both `this` and the argument are `Left` */
  alt(other: EitherAsync<L, R>): EitherAsync<L, R>
  /** Returns the future value of `this` if it's a `Left`, otherwise it returns a future of the result of applying the function argument to `this` and wrapping it in a `Right` */
  extend<R2>(f: (value: EitherAsync<L, R>) => R2): EitherAsync<L, R2>
  /** Returns the value inside `this` if it\'s `Left` or a default value if `this` is `Right` */
  leftOrDefault(defaultValue: L): Promise<L>
  /** Returns the value inside `this` if it\'s `Right` or a default value if `this` is `Left` */
  orDefault(defaultValue: R): Promise<R>
  /* Similar to the Promise method of the same name, the provided function is called when the `EitherAsync` is executed regardless of whether the `Either` result is `Left` or `Right` */
  finally(effect: () => any): EitherAsync<L, R>
  'fantasy-land/map'<R2>(f: (value: R) => R2): EitherAsync<L, R2>
  'fantasy-land/bimap'<L2, R2>(
    f: (value: L) => L2,
    g: (value: R) => R2
  ): EitherAsync<L2, R2>

  'fantasy-land/ap'<R2>(
    other: EitherAsync<L, (value: R) => R2>
  ): EitherAsync<L, R2>
  'fantasy-land/chain'<R2>(
    f: (value: R) => EitherAsync<L, R2>
  ): EitherAsync<L, R2>
  'fantasy-land/ap'<R2>(
    other: EitherAsync<L, (value: R) => R2>
  ): EitherAsync<L, R2>
  'fantasy-land/alt'(other: EitherAsync<L, R>): EitherAsync<L, R>
  'fantasy-land/extend'<R2>(
    f: (value: EitherAsync<L, R>) => R2
  ): EitherAsync<L, R2>
  /** WARNING: This is implemented only for Promise compatibility. Please use `chain` instead. */
  then: PromiseLike<Either<L, R>>['then']
}

export interface EitherAsyncValue<R> extends PromiseLike<R> {}

export interface EitherAsyncHelpers<L> {
  /** Allows you to take a regular Either value and lift it to the `EitherAsync` context. Awaiting a lifted Either will give you the `Right` value inside. If the Either is Left then the function will exit immediately and EitherAsync will resolve to that Left after running it */
  liftEither<R>(either: Either<L, R>): EitherAsyncValue<R>
  /** Allows you to take an Either inside a Promise and lift it to the `EitherAsync` context. Awaiting a lifted Promise<Either> will give you the `Right` value inside the Either. If the Either is Left or the Promise is rejected then the function will exit immediately and MaybeAsync will resolve to that Left or the rejection value after running it */
  fromPromise<R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R>
  /** A type safe version of throwing an exception. Unlike the Error constructor, which will take anything, throwE only accepts values of the same type as the Left part of the Either */
  throwE(error: L): never
}

const helpers: EitherAsyncHelpers<any> = {
  liftEither<L, R>(either: Either<L, R>): EitherAsyncValue<R> {
    if (either.isRight()) {
      return Promise.resolve(either.extract())
    }

    throw either.extract()
  },
  fromPromise<L, R>(promise: PromiseLike<Either<L, R>>): EitherAsyncValue<R> {
    return promise.then(helpers.liftEither) as EitherAsyncValue<R>
  },
  throwE<L>(error: L): never {
    throw error
  }
}

class EitherAsyncImpl<L, R> implements EitherAsync<L, R> {
  [Symbol.toStringTag]: 'EitherAsync' = 'EitherAsync'

  constructor(
    private runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
  ) {}

  readonly _URI!: EITHER_ASYNC_URI
  readonly _A!: [R, L];

  *[Symbol.iterator]() {
    return (yield this) as R
  }
  [ofSymbol] = EitherAsync.of

  async leftOrDefault(defaultValue: L): Promise<L> {
    const either = await this.run()
    return either.leftOrDefault(defaultValue)
  }

  async orDefault(defaultValue: R): Promise<R> {
    const either = await this.run()
    return either.orDefault(defaultValue)
  }

  join<R2>(this: EitherAsync<L, EitherAsync<L, R2>>): EitherAsync<L, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      if (either.isRight()) {
        const nestedEither = await either.extract()
        return helpers.liftEither(nestedEither)
      }
      return helpers.liftEither((either as any) as Either<L, R2>)
    })
  }

  ap<R2>(other: EitherAsync<L, (value: R) => R2>): EitherAsync<L, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      const o = await other
      return helpers.liftEither(either.ap(o))
    })
  }
  'fantasy-land/ap'<R2>(
    other: EitherAsync<L, (value: R) => R2>
  ): EitherAsync<L, R2> {
    return this.ap(other)
  }
  alt(other: EitherAsync<L, R>): EitherAsync<L, R> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      const o = await other
      return helpers.liftEither(either.alt(o))
    })
  }
  'fantasy-land/alt'(other: EitherAsync<L, R>): EitherAsync<L, R> {
    return this.alt(other)
  }

  extend<R2>(f: (value: EitherAsync<L, R>) => R2): EitherAsync<L, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      if (either.isRight()) {
        const v = EitherAsync.liftEither(either)
        return helpers.liftEither(Right(f(v)))
      }
      return helpers.liftEither((either as any) as Either<L, R2>)
    })
  }
  'fantasy-land/extend'<R2>(
    f: (value: EitherAsync<L, R>) => R2
  ): EitherAsync<L, R2> {
    return this.extend(f)
  }

  async run(): Promise<Either<L, R>> {
    try {
      return Right(await this.runPromise(helpers))
    } catch (e) {
      return Left(e)
    }
  }

  bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): EitherAsync<L2, R2> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      return helpers.liftEither(either.bimap(f, g))
    })
  }

  map<R2>(f: (value: R) => R2): EitherAsync<L, R2> {
    return EitherAsync((helpers) => this.runPromise(helpers).then(f))
  }

  mapLeft<L2>(f: (value: L) => L2): EitherAsync<L2, R> {
    return EitherAsync(async (helpers) => {
      try {
        return await this.runPromise((helpers as any) as EitherAsyncHelpers<L>)
      } catch (e) {
        throw f(e)
      }
    })
  }

  chain<R2>(f: (value: R) => EitherAsync<L, R2>): EitherAsync<L, R2> {
    return EitherAsync(async (helpers) => {
      const value = await this.runPromise(helpers)
      return helpers.fromPromise(f(value))
    })
  }

  chainLeft<L2>(f: (value: L) => EitherAsync<L2, R>): EitherAsync<L2, R> {
    return EitherAsync(async (helpers) => {
      try {
        return await this.runPromise((helpers as any) as EitherAsyncHelpers<L>)
      } catch (e) {
        return helpers.fromPromise(f(e))
      }
    })
  }

  toMaybeAsync(): MaybeAsync<R> {
    return MaybeAsync(async ({ liftMaybe }) => {
      const either = await this.run()
      return liftMaybe(either.toMaybe())
    })
  }

  swap(): EitherAsync<R, L> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      if (either.isRight()) helpers.throwE(either.extract() as R)
      return helpers.liftEither(Right(either.extract() as L))
    })
  }

  ifLeft(effect: (value: L) => any): EitherAsync<L, R> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      either.ifLeft(effect)
      return helpers.liftEither(either)
    })
  }

  ifRight(effect: (value: R) => any): EitherAsync<L, R> {
    return EitherAsync(async (helpers) => {
      const either = await this.run()
      either.ifRight(effect)
      return helpers.liftEither(either)
    })
  }

  finally(effect: () => any): EitherAsync<L, R> {
    return EitherAsync(({ fromPromise }) =>
      fromPromise(this.run().finally(effect))
    )
  }

  'fantasy-land/map'<R2>(f: (value: R) => R2): EitherAsync<L, R2> {
    return this.map(f)
  }

  'fantasy-land/bimap'<L2, R2>(
    f: (value: L) => L2,
    g: (value: R) => R2
  ): EitherAsync<L2, R2> {
    return this.bimap(f, g)
  }

  'fantasy-land/chain'<R2>(
    f: (value: R) => EitherAsync<L, R2>
  ): EitherAsync<L, R2> {
    return this.chain(f)
  }

  then<TResult1 = Either<L, R>, TResult2 = never>(
    onfulfilled?:
      | ((value: Either<L, R>) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.run().then(onfulfilled, onrejected)
  }
}

export const EitherAsync: EitherAsyncTypeRef = Object.assign(
  <L, R>(
    runPromise: (helpers: EitherAsyncHelpers<L>) => PromiseLike<R>
  ): EitherAsync<L, R> => new EitherAsyncImpl(runPromise),
  {
    of<L, R>(value: R): EitherAsync<L, R> {
      return EitherAsync.liftEither(Right(value))
    },
    fromPromise: <L, R>(
      f: () => PromiseLike<Either<L, R>>
    ): EitherAsync<L, R> => EitherAsync(({ fromPromise: fP }) => fP(f())),
    liftPromise: <R, L = Error>(f: () => PromiseLike<R>): EitherAsync<L, R> =>
      EitherAsync(f),
    liftEither: <L, R>(either: Either<L, R>): EitherAsync<L, R> =>
      EitherAsync(({ liftEither }) => liftEither(either)),
    lefts: <L, R>(list: EitherAsync<L, R>[]): Promise<L[]> =>
      Promise.all(list.map((x) => x.run())).then(Either.lefts),
    rights: <L, R>(list: EitherAsync<L, R>[]): Promise<R[]> =>
      Promise.all(list.map((x) => x.run())).then(Either.rights),
    sequence: <L, R>(eas: EitherAsync<L, R>[]): EitherAsync<L, R[]> =>
      EitherAsync(async (helpers) => {
        let res: R[] = []

        for await (const e of eas) {
          if (e.isLeft()) {
            return helpers.liftEither(e)
          }

          res.push(e.extract() as R)
        }

        return helpers.liftEither(Right(res))
      })
  }
)

EitherAsyncImpl.prototype.constructor = EitherAsync
