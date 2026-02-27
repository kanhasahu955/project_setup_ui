import { gql } from "@apollo/client"

import meQuery from "@/graphql/queries/me.graphql?raw"
import healthQuery from "@/graphql/queries/health.graphql?raw"
import listingsQuery from "@/graphql/queries/listings.graphql?raw"
import myListingsQuery from "@/graphql/queries/myListings.graphql?raw"
import listingQuery from "@/graphql/queries/listing.graphql?raw"
import listingCommentsQuery from "@/graphql/queries/listingComments.graphql?raw"
import listingReviewsQuery from "@/graphql/queries/listingReviews.graphql?raw"
import myFavoriteListingIdsQuery from "@/graphql/queries/myFavoriteListingIds.graphql?raw"
import registerMutation from "@/graphql/mutations/register.graphql?raw"
import verifyOtpMutation from "@/graphql/mutations/verifyOtp.graphql?raw"
import resendOtpMutation from "@/graphql/mutations/resendOtp.graphql?raw"
import loginMutation from "@/graphql/mutations/login.graphql?raw"
import createListingMutation from "@/graphql/mutations/createListing.graphql?raw"
import updateListingMutation from "@/graphql/mutations/updateListing.graphql?raw"
import deleteListingMutation from "@/graphql/mutations/deleteListing.graphql?raw"
import addListingFavoriteMutation from "@/graphql/mutations/addListingFavorite.graphql?raw"
import removeListingFavoriteMutation from "@/graphql/mutations/removeListingFavorite.graphql?raw"
import createListingCommentMutation from "@/graphql/mutations/createListingComment.graphql?raw"
import deleteListingCommentMutation from "@/graphql/mutations/deleteListingComment.graphql?raw"
import createListingReviewMutation from "@/graphql/mutations/createListingReview.graphql?raw"
import updateListingReviewMutation from "@/graphql/mutations/updateListingReview.graphql?raw"
import deleteListingReviewMutation from "@/graphql/mutations/deleteListingReview.graphql?raw"

/** Current authenticated user (requires Bearer token). */
export const ME = gql(meQuery)

/** Health check (no auth required). */
export const HEALTH = gql(healthQuery)

/** List listings (public or filtered). */
export const LISTINGS = gql(listingsQuery)

/** Current user's listings. */
export const MY_LISTINGS = gql(myListingsQuery)

/** Single listing by id. */
export const LISTING = gql(listingQuery)

/** Comments for a listing. */
export const LISTING_COMMENTS = gql(listingCommentsQuery)

/** Reviews/ratings for a listing. */
export const LISTING_REVIEWS = gql(listingReviewsQuery)

/** Current user's favorited listing IDs. */
export const MY_FAVORITE_LISTING_IDS = gql(myFavoriteListingIdsQuery)

/** Register: sends OTP to email. */
export const REGISTER = gql(registerMutation)

/** Verify OTP: completes registration, returns user + token. */
export const VERIFY_OTP = gql(verifyOtpMutation)

/** Resend OTP to email. */
export const RESEND_OTP = gql(resendOtpMutation)

/** Login: returns user + token. */
export const LOGIN = gql(loginMutation)

/** Create listing. */
export const CREATE_LISTING = gql(createListingMutation)

/** Update listing. */
export const UPDATE_LISTING = gql(updateListingMutation)

/** Delete listing. */
export const DELETE_LISTING = gql(deleteListingMutation)

/** Add listing to favorites. */
export const ADD_LISTING_FAVORITE = gql(addListingFavoriteMutation)

/** Remove listing from favorites. */
export const REMOVE_LISTING_FAVORITE = gql(removeListingFavoriteMutation)

/** Create a comment on a listing. */
export const CREATE_LISTING_COMMENT = gql(createListingCommentMutation)

/** Delete a listing comment. */
export const DELETE_LISTING_COMMENT = gql(deleteListingCommentMutation)

/** Create or update listing rating (upsert). */
export const CREATE_LISTING_REVIEW = gql(createListingReviewMutation)

/** Update listing rating. */
export const UPDATE_LISTING_REVIEW = gql(updateListingReviewMutation)

/** Delete listing rating. */
export const DELETE_LISTING_REVIEW = gql(deleteListingReviewMutation)
