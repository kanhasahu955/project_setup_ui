import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"
import { resolveGraphQLUrl } from "@/constants"

export type GetToken = () => string | null

/**
 * Create Apollo Client for the Live Bhoomi GraphQL API.
 * Pass a getToken function that returns the current JWT (e.g. from Redux auth state).
 * Backend expects: Authorization: Bearer <token>
 */
export function createApolloClient(getToken: GetToken): ApolloClient {
  const httpLink = new HttpLink({
    uri: resolveGraphQLUrl(),
    fetchOptions: {
      credentials: "same-origin",
    },
  })

  const authLink = setContext((_operation, prevContext) => {
    const token = getToken()
    const headers = (prevContext?.headers as Record<string, string> | undefined) ?? {}
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }
  })

  const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  })

  return client
}
