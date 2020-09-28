import { ApKind } from './ap'
import { TypeFromHKT } from './hkt'

export const lift = <A, R>(f: (a: A) => R) => <
  HKT1 extends ApKind<any, [A, ...any]>
>(
  a: HKT1
): TypeFromHKT<HKT1, [R]> => {
  return a.map(f)
}

export const lift2C = <A, B, R>(f: (a: A) => (b: B) => R) => <
  HKT1 extends ApKind<any, [A, ...any]>
>(
  a: HKT1
) => (b: TypeFromHKT<HKT1, [B]>): TypeFromHKT<HKT1, [R]> => {
  return b.ap(a.map(f))
}

export const lift2 = <A, B, R>(f: (a: A, b: B) => R) => <
  HKT1 extends ApKind<any, [A, ...any]>
>(
  a: HKT1
) => (b: TypeFromHKT<HKT1, [B]>): TypeFromHKT<HKT1, [R]> => {
  const fn = (a: any) => (b: any) => f(a, b)
  return b.ap(a.map(fn))
}

export const lift3C = <A, B, C, R>(f: (a: A) => (b: B) => (c: C) => R) => <
  HKT1 extends ApKind<any, [A, ...any]>
>(
  a: HKT1
) => (b: TypeFromHKT<HKT1, [B]>) => (
  c: TypeFromHKT<HKT1, [C]>
): TypeFromHKT<HKT1, [R]> => {
  return c.ap(b.ap(a.map((a) => f(a))))
}
export const lift3 = <A, B, C, R>(f: (a: A, b: B, c: C) => R) => <
  HKT1 extends ApKind<any, [A, ...any]>
>(
  a: HKT1
) => (b: TypeFromHKT<HKT1, [B]>) => (
  c: TypeFromHKT<HKT1, [C]>
): TypeFromHKT<HKT1, [R]> => {
  const fn = (a: any) => (b: any) => (c: any) => f(a, b, c)
  return c.ap(b.ap(a.map((a) => fn(a))))
}

export const lift4C = <A, B, C, D, R>(
  f: (a: A) => (b: B) => (c: C) => (d: D) => R
) => <HKT1 extends ApKind<any, [A, ...any]>>(a: HKT1) => (
  b: TypeFromHKT<HKT1, [B]>
) => (c: TypeFromHKT<HKT1, [C]>) => (
  d: TypeFromHKT<HKT1, [D]>
): TypeFromHKT<HKT1, [R]> => {
  // return pipe(
  //   a,
  //   map(f),
  //   (f) => ap(f)(b),
  //   (f) => ap(f)(c),
  //   (f) => ap(f)(d)
  // )

  return d.ap(c.ap(b.ap(a.map((a) => f(a)))))
}

export const lift4 = <A, B, C, D, R>(f: (a: A, b: B, c: C, d: D) => R) => <
  HKT1 extends ApKind<any, [A, ...any]>
>(
  a: HKT1
) => (b: TypeFromHKT<HKT1, [B]>) => (c: TypeFromHKT<HKT1, [C]>) => (
  d: TypeFromHKT<HKT1, [D]>
): TypeFromHKT<HKT1, [R]> => {
  const fn = (a: any) => (b: any) => (c: any) => (d: any) => f(a, b, c, d)
  return d.ap(c.ap(b.ap(a.map((a) => fn(a)))))
}
