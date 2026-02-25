import get from "lodash/get"
import merge from "lodash/merge"
import omit from "lodash/omit"
import pick from "lodash/pick"
import groupBy from "lodash/groupBy"
import isEmpty from "lodash/isEmpty"
import isNil from "lodash/isNil"
import defaultTo from "lodash/defaultTo"
import sortBy from "lodash/sortBy"
import uniqBy from "lodash/uniqBy"
import partition from "lodash/partition"
import map from "lodash/map"
import keyBy from "lodash/keyBy"
import includes from "lodash/includes"
import some from "lodash/some"
import find from "lodash/find"
import compact from "lodash/compact"
import cloneDeep from "lodash/cloneDeep"
import slice from "lodash/slice"
import upperFirst from "lodash/upperFirst"
import join from "lodash/join"
import forOwn from "lodash/forOwn"
import isArray from "lodash/isArray"

export { get, merge, omit, pick, groupBy, isEmpty, isNil, defaultTo, sortBy, uniqBy, partition, map, keyBy, includes, some, find, compact, cloneDeep, slice, upperFirst, join, forOwn, isArray }

export function safeGet<T>(obj: unknown, path: string | string[], defaultValue: T): T {
    const value = get(obj, path)
    return isNil(value) ? defaultValue : (value as T)
}

export function deepMerge<T extends object>(...sources: (object | undefined | null)[]): T {
    return merge({}, ...compact(sources)) as T
}

export function omitKeys<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return omit(obj, keys) as Omit<T, K>
}

export function pickKeys<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return pick(obj, keys) as Pick<T, K>
}

export function isEmptyOrNil(value: unknown): boolean {
    return isNil(value) || isEmpty(value)
}

export function firstDefined<T>(...values: (T | null | undefined)[]): T | undefined {
    return find(values, (v) => !isNil(v)) as T | undefined
}

export function sortByKeys<T>(collection: T[], ...keys: (keyof T | string)[]): T[] {
    return sortBy(collection, keys)
}

export function uniqByKey<T>(collection: T[], key: keyof T | string): T[] {
    return uniqBy(collection, key)
}

export function partitionBy<T>(collection: T[], predicate: (item: T) => boolean): [T[], T[]] {
    return partition(collection, predicate)
}

export function pluck<T, K extends keyof T>(collection: T[], key: K): T[K][] {
    return map(collection, key)
}

export function keyByKey<T extends object>(collection: T[], key: keyof T | string): Record<string, T> {
    return keyBy(collection, key) as Record<string, T>
}

export function firstCharUpper(s: string): string {
    return upperFirst(s[0] ?? "")
}

export { default as clamp } from "lodash/clamp"
export { default as debounce } from "lodash/debounce"
export { default as throttle } from "lodash/throttle"
