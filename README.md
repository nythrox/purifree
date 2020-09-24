<h3 align="center">
  <img align="center" src="assets/logo.png" alt="Purify logo" width="112" />
</h3

<p align="center">
    <a href="https://travis-ci.org/gigobyte/purify">
      <img src="https://travis-ci.org/gigobyte/purify.svg?branch=master" alt="Build Status">
      <img src="https://camo.githubusercontent.com/41c68e9f29c6caccc084e5a147e0abd5f392d9bc/68747470733a2f2f62616467656e2e6e65742f62616467652f547970655363726970742f7374726963742532302546302539462539322541412f626c7565" alt="Built with Typescript">
    </a>
</p>

# Purifree
Purifree is a fork from <a href="https://github.com/gigobyte/purify">Purify</a> that allows you to program in a point-free style, and adds a few new capabilities.
# What is purify?

Purify is a library for functional programming in TypeScript.
Its purpose is to allow developers to use popular patterns and abstractions that are available in most functional languages.
Learn more about Purify <a href="https://github.com/gigobyte/purify">here</a>

# Purify compatability
Purifree is 100% compatible with purify, and can be used interchangeably.
## Point-free style
Point-free style:
```typescript
// pointfree :: EitherAsync<Error, number>
const pointfree = pipe(
  // Either<never, number>
  Right(0),
  map(num => num * 2),
  match({
    Right: () => Just(5),
    Left: () => Just(5)
  }),
  // Maybe<number>
  map((num) => num * 2),
  match({
    Just: (n) => Tuple(n, 2),
    Nothing: () => Tuple(1, 2)
  }),
  // Tuple<number, number>
  map((scnd) => scnd * 2),
  (tuple) => EitherAsync.of<Error>(tuple),
  // EitherAsync<Error, Tuple<number, number>>
  map(reduce((prev, curr) => prev + curr, 0))
  // EitherAsync<Error, number>
)
```
Chainable style:
```typescript
// chainable :: EitherAsync<Error, number>
const chainable = EitherAsync.of<Error>(
  Right(0)
    .map((num) => num * 2)
    .caseOf({
      Right: () => Just(5),
      Left: () => Just(5)
    })
    .map((num) => num * 2)
    .caseOf({
      Just: (n) => Tuple(n, 2),
      Nothing: () => Tuple(1, 2)
    })
    .map((scnd) => scnd * 2)
).map(reduce((prev, curr) => prev + curr, 0))
```
Both styles can be used together:
```typescript
  pipe(
    Right(0),
	map(n => n * 2)
  ).caseOf({
     _:() => console.log("done!")
  })
```

## Do* notation
This fork features the generator do* notation for all data structures except for arrays.
The do notation lets you easily chain operations without having to nest your code.
```typescript
// result :: Either<Error, { name: string, surname: string, favoriteColor: string }>
const result = Do(function* () {
  // name :: string
  const name = yield* Right("Jason")
  // surname :: string
  const surname = yield* Right("Santiago")
  // favoriteColor :: string
  const favoriteColor = yield* Left<Error, string>(Error("DB error!"))
  return {
    name,
    surname,
    favoriteColor
  }
})
```
Chain version equivalent: 
```typescript
// result :: Either<Error, { name: string, surname: string, favoriteColor: string }>
const result = Right<string, Error>('jason').chain((name) =>
  Right<string, Error>('Santiago').chain((surname) =>
    Left<Error, string>(Error('DB error!')).map((favoriteColor) => ({
      name,
      surname,
      favoriteColor
    }))
  )
)
```
Point-free version equivalent
```typescript
// result :: Either<Error, { name: string, surname: string, favoriteColor: string }>
const result = pipe(
  Right<string, Error>('Jason'),
  chain((name) =>
    pipe(
      Right<string, Error>('Santiago'),
      chain((surname) =>
        pipe(
          Left<Error, string>(Error('DB error!')),
          map((favoriteColor) => ({
            name: name,
            surname,
            favoriteColor
          }))
        )
      )
    )
  )
)
```
### Traverse, Sequence, SequenceS, SequenceT
```typescript
// Gets an Either<never, number>, maps it to an Either<never, NonEmptyList<number>>, and inverts it into a NonEmptyList<Either<never, number>>
// traverseTest :: NonEmptyList<Either<never, number>>
const traverseTest = pipe(
  Right(1),
  traverse(NonEmptyList, (num) => NonEmptyList(num))
)

// Gets an Either<never, NonEmptyList<number>> and inverts it into a NonEmptyList<Either<never, number>>
// sequenceTest :: NonEmptyList<Either<never, number>>
const sequenceTest = pipe(
  Right(NonEmptyList(1)),
  sequence(NonEmptyList)
)

// sequenceTTest :: Either<never, [number, string, boolean]>
const sequenceTTest = sequenceT(Either.of)(Right(2), Right('name'), Right(true))

// sequenceStrutureTest :: Either<string, { name: string, age: number }>
const sequenceStrutureTest = sequenceS(Either.of)({
  name: Right<string, string>('name'),
  age: Right<number, string>(100)
})

```
### Kleisli flow
Kleisli flow can be used as an easy way to combine functions that return monads without using chain.
```typescript
// getNameTest :: ( name?: string ) => Maybe<string>
const getNameTest = kleisli(
  (name?: string) => name ? Just(name) : Nothing,
  (name) => Just(name.toUpperCase()),
  (uppercasedName) => uppercasedName.length > 3 ? Just(uppercasedName) : Nothing
)
// result :: Maybe<string>
const result = getNameTest('jason')

```