import type { ApolloClient } from "@apollo/client/core"
import {
  ApolloClient as ApolloClientConstructor,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client/core"
import { setContext } from "@apollo/client/link/context"
import { resolveGraphQLUrl } from "@/constants"

export type GetToken = () => string | null

let apolloClientInstance: ApolloClient<unknown> | null = null

/** Set the client after creation (e.g. in main.tsx). Used by Redux thunks for auth. */
export function setApolloClient(client: ApolloClient<unknown>): void {
  apolloClientInstance = client
}

/** Get Apollo client for use outside React (e.g. Redux thunks). Throws if not set. */
export function getApolloClient(): ApolloClient<unknown> {
  if (!apolloClientInstance) throw new Error("Apollo client not initialized")
  return apolloClientInstance
}

/**
 * Create Apollo Client for the Live Bhoomi GraphQL API.
 * Pass a getToken function that returns the current JWT (e.g. from Redux auth state).
 * Backend expects: Authorization: Bearer <token>
 */
export function createApolloClient(getToken: GetToken): ApolloClient<unknown> {
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

  const client = new ApolloClientConstructor({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        // Allow mutation results (e.g. createListing) to be written without "Missing field" errors
        Mutation: {
          merge(_, incoming) {
            return { ..._, ...incoming }
          },
        },
      },
    }),
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
