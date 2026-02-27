import { createAsyncThunk } from "@reduxjs/toolkit"
import type { CreateListingInput, UpdateListingInput } from "@/@types/listing.type"
import type { Listing } from "@/@types/listing.type"
import { getApolloClient } from "@/config/apollo.config"
import { CREATE_LISTING, UPDATE_LISTING, DELETE_LISTING, LISTINGS } from "@/graphql/operations"
import { getErrorMessage } from "@/utils/request.util"

/** Create listing via GraphQL. Returns the created listing. */
export const createListing = createAsyncThunk<
  Listing,
  CreateListingInput,
  { rejectValue: string }
>(
  "listing/create",
  async (input, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({
        mutation: CREATE_LISTING,
        variables: { input },
        refetchQueries: [{ query: LISTINGS, variables: { input: { page: 1, limit: 20 } } }],
      })
      const data = result.data as { createListing?: Listing } | undefined
      const listing = data?.createListing
      if (result.errors?.length || !listing) {
        return rejectWithValue(
          (result.errors?.[0] as { message?: string })?.message ?? "Failed to create listing"
        )
      }
      return listing
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Failed to create listing"))
    }
  },
)

/** Update listing via GraphQL. Returns the updated listing. */
export const updateListing = createAsyncThunk<
  Listing,
  { id: string; input: UpdateListingInput },
  { rejectValue: string }
>(
  "listing/update",
  async ({ id, input }, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({
        mutation: UPDATE_LISTING,
        variables: { id, input },
        fetchPolicy: "no-cache",
      })
      const root = result.data as { updateListing?: Listing; data?: { updateListing?: Listing } } | undefined
      const listing = root?.data?.updateListing ?? root?.updateListing
      if (result.errors?.length || !listing) {
        return rejectWithValue(
          (result.errors?.[0] as { message?: string })?.message ?? "Failed to update listing"
        )
      }
      return listing
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Failed to update listing"))
    }
  },
)

/** Delete listing via GraphQL. */
export const deleteListing = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>(
  "listing/delete",
  async (id, { rejectWithValue }) => {
    try {
      const client = getApolloClient()
      const result = await client.mutate({
        mutation: DELETE_LISTING,
        variables: { id },
      })
      const data = result.data as { deleteListing?: { success: boolean; message: string } } | undefined
      const res = data?.deleteListing
      if (result.errors?.length || !res?.success) {
        return rejectWithValue(
          (result.errors?.[0] as { message?: string })?.message ?? res?.message ?? "Failed to delete listing"
        )
      }
      return { success: res.success, message: res.message ?? "Listing deleted" }
    } catch (e) {
      return rejectWithValue(getErrorMessage(e, "Failed to delete listing"))
    }
  },
)
