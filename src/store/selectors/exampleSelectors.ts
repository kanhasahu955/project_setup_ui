import { createSelector } from '@reduxjs/toolkit'
import { groupBy, firstCharUpper } from '@/utils/lodash.util'
import type { RootState } from '@/store/store'
import type { ExampleItem } from '@/store/slices/exampleSlice'

const selectExampleState = (state: RootState) => state.example

export const selectExampleItems = createSelector(
  [selectExampleState],
  (example) => example.items,
)

export const selectIsLoading = createSelector(
  [selectExampleState],
  (example) => example.isLoading,
)

export const selectError = createSelector(
  [selectExampleState],
  (example) => example.error,
)

export type GroupedExampleItems = Record<string, ExampleItem[]>

export const selectItemsGroupedByFirstLetter = createSelector(
  [selectExampleItems],
  (items): GroupedExampleItems =>
    groupBy(items, (item) => firstCharUpper(item.name)),
)

