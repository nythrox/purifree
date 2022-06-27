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

Purifree is available as a package on [Deno.land/x](https://deno.land/x/purifree-ts). Looking for the Node version? [Here](https://github.com/nythrox/purifree)

```ts
import { map, chain, ... } from "https://deno.land/x/purifree@v1.2.4/mod.ts"
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
  caseOf({
    Right: (e) => 'Great number!' + e,
    Left: (e) => `OK number. | msg: (${e})`
  })
)
```

### Kleisli

The function Kleisli can be used as an easy way to combine functions that return monads without using chain.
If you need to use a long list of chains, you can use the Kleisli function to compose the functions instead of passing each one into chain.
Instead of:

```typescript
// getNameTest: ( name?: string ) => Maybe<string>
const getNameTest = (name?: string) => pipe(
  Maybe.of(name),
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
