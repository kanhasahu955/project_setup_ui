import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchExampleItems } from '@/store/slices/exampleSlice'
import {
  selectError,
  selectIsLoading,
  selectItemsGroupedByFirstLetter,
} from '@/store/selectors/exampleSelectors'
import { UsersExample } from '@/features/users/UsersExample'

const App = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const groupedItems = useAppSelector(selectItemsGroupedByFirstLetter)

  useEffect(() => {
    void dispatch(fetchExampleItems())
  }, [dispatch])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <section className="w-full max-w-2xl rounded-xl bg-slate-900/70 shadow-lg border border-slate-800 p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Live Bhoomi UI – Example
          </h1>
          <p className="text-sm text-slate-400">
            Axios client + Redux Toolkit + lodash, wired with TypeScript.
          </p>
        </header>

        {isLoading && (
          <p className="text-sm text-amber-300">Loading items from API…</p>
        )}

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="space-y-3">
            <h2 className="font-medium text-slate-200 text-sm">
              Items grouped by first letter (lodash `groupBy`)
            </h2>

            {Object.keys(groupedItems).length === 0 ? (
              <p className="text-sm text-slate-500">
                No items yet. Point the example thunk to a real endpoint to see
                data from your API.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(groupedItems).map(([letter, items]) => (
                  <div
                    key={letter}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-1"
                  >
                    <div className="text-xs font-semibold uppercase text-slate-400">
                      {letter}
                    </div>
                    <ul className="text-sm text-slate-100 list-disc list-inside space-y-0.5">
                      {items.map((item) => (
                        <li key={item.id}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <UsersExample />
      </section>
    </main>
  )
}

export default App