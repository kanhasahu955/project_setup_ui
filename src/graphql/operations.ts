import { gql } from "@apollo/client"

/** Current authenticated user (requires Bearer token). */
export const ME = gql`
  query Me {
    me {
      id
      name
      email
      phone
      role
      isEmailVerified
      isPhoneVerified
      avatar
      lastLogin
      kyc {
        kycStatus
        isAadharVerified
        isPanVerified
      }
      profile {
        id
        bio
        companyName
        designation
      }
    }
  }
`

/** Health check (no auth required). */
export const HEALTH = gql`
  query Health($detailed: Boolean) {
    health(detailed: $detailed) {
      status
      uptime
      timestamp
    }
  }
`

// ============ Auth mutations (align with fastify_backend GraphQL schema) ============

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      message
      email
    }
  }
`

export const VERIFY_OTP = gql`
  mutation VerifyOtp($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      user {
        id
        name
        email
        phone
        role
        isEmailVerified
        isPhoneVerified
        avatar
        lastLogin
      }
      token
    }
  }
`

export const RESEND_OTP = gql`
  mutation ResendOtp($input: ResendOtpInput!) {
    resendOtp(input: $input) {
      message
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        phone
        role
        isEmailVerified
        isPhoneVerified
        avatar
        lastLogin
      }
      token
    }
  }
`
