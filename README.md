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
# What is Purify?
Purify is a library for functional programming in TypeScript.
Its purpose is to allow developers to use popular patterns and abstractions that are available in most functional languages.
Learn more about Purify <a href="https://github.com/gigobyte/purify">here</a>
# How to start?
Purifree is available as a package on npm. You can install it with a package manager of your choice:
```
$ npm install purifree-ts
```
# Purifree compatability
Purifree is 100% compatible with purify, and can be used interchangeably.
## Point-free style 
Point-free functions can be used with any ADTs (without needing module-specific imports), and can also be used together with the chainable (<a href="https://github.com/gigobyte/purify">purify</a>) API. 
```typescript
// pointfree: Maybe<string>
const pointfree = pipe(
  Just('name'),
  map((name) => name.toUpperCase()),
  filter((name) => name.length > 5),
  chain((name) => (Math.random() > 0.5 ? Just(name + ' lucky :)') : Nothing))
)
// matchTest: string
const matchTest = pipe(
  Right<number, string>(100),
  chain((num) => (num > 50 ? Right(num) : Left(`bad number: ${num}`))),
  match({
    Right: (e) => 'Great number!' + e,
    Left: (e) => `OK number. | msg: (${e})`
  })
)
```

## Do* notation
This fork features the generator do* notation for all data structures except for arrays.
The do notation lets you easily chain operations without having to nest your code.
```typescript
// result: Either<Error, { name: string, surname: string, favoriteColor: string }>
const result = Do(function* () {
  // name: string
  const name = yield* Right("name")
  // surname: string
  const surname = yield* Right("surname")
  // favoriteColor: string
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
// result: Either<Error, { name: string, surname: string, favoriteColor: string }>
const result = Right<string, Error>('name').chain((name) =>
  Right<string, Error>('surname').chain((surname) =>
    Left<Error, string>(Error('DB error!')).map((favoriteColor) => ({
      name,
      surname,
      favoriteColor
    }))
  )
)
```
### Traverse, Sequence, SequenceS, SequenceT
```typescript
// Gets an Either<never, number>, maps it to an Either<never, NonEmptyList<number>>, and inverts it into a NonEmptyList<Either<never, number>>
// traverseTest: NonEmptyList<Either<never, number>>
const traverseTest = pipe(
  Right(1),
  traverse(NonEmptyList, (num) => NonEmptyList(num))
)

// Gets an Either<never, NonEmptyList<number>> and inverts it into a NonEmptyList<Either<never, number>>
// sequenceTest: NonEmptyList<Either<never, number>>
const sequenceTest = pipe(
  Right(NonEmptyList(1)),
  sequence(NonEmptyList)
)

// sequenceTTest: Either<never, [number, string, boolean]>
const sequenceTTest = sequenceT(Either.of)(Right(2), Right('name'), Right(true))

// sequenceStrutureTest: Either<string, { name: string, age: number }>
const sequenceStrutureTest = sequenceS(Either.of)({
  name: Right<string, string>('name'),
  age: Right<number, string>(100)
})

```
### Kleisli
The function pipeK can be used as an easy way to combine functions that return monads without using chain.
If you need to use a long list of chains, you can use the pipeK function to compose the functions instead of passing each one into chain.
Instead of: 
```typescript
const getNameTest = pipe(
  chain((name?: string) => name ? Just(name) : Nothing),
  chain((name) => Just(name.toUpperCase())),
  chain((uppercasedName) => uppercasedName.length > 3 ? Just(uppercasedName) : Nothing)
)
```
Use:
```typescript
// getNameTest: ( name?: string ) => Maybe<string>
const getNameTest = kleisli(
  (name?: string) => name ? Just(name) : Nothing,
  (name) => Just(name.toUpperCase()),
  (uppercasedName) => uppercasedName.length > 3 ? Just(uppercasedName) : Nothing
)
// result: Maybe<string>
const result = getNameTest('name')
```
### Lifting
You can use the liftN family of functions to lift a function that takes normal values into a function that takes and returns elevated values.
*WARNING*: If you try lifting a function that uses generics, it will probably loose its type due to typescript's limitations.
```typescript
// add takes normal values
const add = (num1: number, num2: number) => num1 + num2
// addL takes elevated values, and returns an elevated value
// addL: Lifted<(a: Ap<number>, b: Ap<number>) => Ap<number>> 
const addL = lift2(add)
// add5Option (b: Either<never, number>) => Either<never, number>
const add5Option = addL(Right(5))
// result: Either<never, number> = Right(15)
const result = add5Option(Right(10))
```

### Codesandbox
You can try it out <a href="https://codesandbox.io/s/purifree-template-hcyzs"> in the browser.  </a>
