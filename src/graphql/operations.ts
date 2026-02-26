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
      kyc {
        kycStatus
        isAadharVerified
        isPanVerified
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
