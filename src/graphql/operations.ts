import { gql } from "@apollo/client"

import meQuery from "@/graphql/queries/me.graphql?raw"
import healthQuery from "@/graphql/queries/health.graphql?raw"
import listingsQuery from "@/graphql/queries/listings.graphql?raw"
import myListingsQuery from "@/graphql/queries/myListings.graphql?raw"
import listingQuery from "@/graphql/queries/listing.graphql?raw"
import registerMutation from "@/graphql/mutations/register.graphql?raw"
import verifyOtpMutation from "@/graphql/mutations/verifyOtp.graphql?raw"
import resendOtpMutation from "@/graphql/mutations/resendOtp.graphql?raw"
import loginMutation from "@/graphql/mutations/login.graphql?raw"
import createListingMutation from "@/graphql/mutations/createListing.graphql?raw"
import updateListingMutation from "@/graphql/mutations/updateListing.graphql?raw"
import deleteListingMutation from "@/graphql/mutations/deleteListing.graphql?raw"

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
