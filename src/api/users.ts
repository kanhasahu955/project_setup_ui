import { get } from '@/api/httpClient'

export interface User {
  id: string
  name: string
  email: string
}

// Frontend path: '/api/users'
// Backend URL (with your settings): 'http://localhost:8000/api/v1/users'
export const fetchUsers = () => get<User[]>('/users')

