import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchUsers } from '@/store/slices/usersSlice'

export const UsersExample = () => {
  const dispatch = useAppDispatch()
  const { items: users, isLoading, error } = useAppSelector(
    (state) => state.users,
  )
  useEffect(() => {
    void dispatch(fetchUsers())
  }, [dispatch])

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-100">
          Users (Vite proxy example)
        </h2>
        <p className="text-xs text-slate-400">
          Frontend calls <code>/api/users</code> → Vite proxy →
          <code>http://localhost:8000/api/v1/users</code>
        </p>
      </header>

      {isLoading && (
        <p className="text-sm text-amber-300">Loading users…</p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <>
          {users.length === 0 ? (
            <p className="text-sm text-slate-500">
              No users returned. Make sure your backend implements
              <code className="ml-1">GET /api/v1/users</code>.
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-100">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2"
                >
                  <span>{user.name}</span>
                  <span className="text-xs text-slate-400">
                    {user.email}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

