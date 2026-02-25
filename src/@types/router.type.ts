import type { Location } from 'react-router-dom'
import type { AppPath } from '@/routes/paths'
import { get, defaultTo } from '@/utils/lodash.util'

export interface LocationStateFrom {
  from?: Location
}

export type LoginLocationState = LocationStateFrom | null

export function getRedirectPath(state: LoginLocationState, defaultPath: AppPath): AppPath | string {
  const path = get(state, 'from.pathname') as string | undefined
  return defaultTo(path, defaultPath)
}
