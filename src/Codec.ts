import { Codec as C, map } from 'purify-ts'

export const Codec = {
    map,
    ...C,
}

export type { FromType, GetType } from 'purify-ts/Codec'

export {
    string,
    number,
    nullType,
    optional,
    nullable,
    boolean,
    unknown,
    enumeration,
    oneOf,
    array,
    record,
    exactly,
    lazy,
    maybe,
    nonEmptyList,
    tuple,
    date,
    intersect,
    parseError,
} from 'purify-ts/Codec'
