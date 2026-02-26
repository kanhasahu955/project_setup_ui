import { useQuery } from "@apollo/client/react"
import { ME } from "@/graphql/operations"

/**
 * Fetch current user via GraphQL (backend query: me).
 * Requires authenticated user (Bearer token in Apollo auth link).
 */
export function useMeQuery() {
  return useQuery(ME, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  })
}
