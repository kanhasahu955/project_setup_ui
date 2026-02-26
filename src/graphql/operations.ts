import { gql } from "@apollo/client"

import meQuery from "@/graphql/queries/me.graphql?raw"
import healthQuery from "@/graphql/queries/health.graphql?raw"
import registerMutation from "@/graphql/mutations/register.graphql?raw"
import verifyOtpMutation from "@/graphql/mutations/verifyOtp.graphql?raw"
import resendOtpMutation from "@/graphql/mutations/resendOtp.graphql?raw"
import loginMutation from "@/graphql/mutations/login.graphql?raw"

/** Current authenticated user (requires Bearer token). */
export const ME = gql(meQuery)

/** Health check (no auth required). */
export const HEALTH = gql(healthQuery)

/** Register: sends OTP to email. */
export const REGISTER = gql(registerMutation)

/** Verify OTP: completes registration, returns user + token. */
export const VERIFY_OTP = gql(verifyOtpMutation)

/** Resend OTP to email. */
export const RESEND_OTP = gql(resendOtpMutation)

/** Login: returns user + token. */
export const LOGIN = gql(loginMutation)
