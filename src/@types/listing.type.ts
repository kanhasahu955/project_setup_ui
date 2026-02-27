/** Backend enums (match fastify_backend GraphQL schema). */
export const LISTING_TYPE = {
  SALE: "SALE",
  RENT: "RENT",
  LEASE: "LEASE",
} as const
export type ListingType = (typeof LISTING_TYPE)[keyof typeof LISTING_TYPE]

export const PROPERTY_CONDITION = {
  NEW: "NEW",
  RESALE: "RESALE",
  UNDER_CONSTRUCTION: "UNDER_CONSTRUCTION",
  READY_TO_MOVE: "READY_TO_MOVE",
} as const
export type PropertyCondition = (typeof PROPERTY_CONDITION)[keyof typeof PROPERTY_CONDITION]

export const PROPERTY_TYPE = {
  APARTMENT: "APARTMENT",
  INDEPENDENT_HOUSE: "INDEPENDENT_HOUSE",
  VILLA: "VILLA",
  STUDIO_APARTMENT: "STUDIO_APARTMENT",
  PENTHOUSE: "PENTHOUSE",
  BUILDER_FLOOR: "BUILDER_FLOOR",
  OFFICE_SPACE: "OFFICE_SPACE",
  SHOP: "SHOP",
  SHOWROOM: "SHOWROOM",
  WAREHOUSE: "WAREHOUSE",
  INDUSTRIAL_BUILDING: "INDUSTRIAL_BUILDING",
  CO_WORKING: "CO_WORKING",
  RESIDENTIAL_PLOT: "RESIDENTIAL_PLOT",
  COMMERCIAL_PLOT: "COMMERCIAL_PLOT",
  AGRICULTURAL_LAND: "AGRICULTURAL_LAND",
  PG: "PG",
  HOSTEL: "HOSTEL",
} as const
export type PropertyType = (typeof PROPERTY_TYPE)[keyof typeof PROPERTY_TYPE]

export const LISTING_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  ACTIVE: "ACTIVE",
  UNDER_REVIEW: "UNDER_REVIEW",
  SOLD: "SOLD",
  RENTED: "RENTED",
  EXPIRED: "EXPIRED",
  REJECTED: "REJECTED",
  BLOCKED: "BLOCKED",
  ARCHIVED: "ARCHIVED",
} as const
export type ListingStatus = (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS]

export const FURNISHING_TYPE = {
  UNFURNISHED: "UNFURNISHED",
  SEMI_FURNISHED: "SEMI_FURNISHED",
  FULLY_FURNISHED: "FULLY_FURNISHED",
} as const
export type FurnishingType = (typeof FURNISHING_TYPE)[keyof typeof FURNISHING_TYPE]

export interface ListingImageInput {
  url: string
  isPrimary?: boolean
  order?: number
}

export interface CreateListingInput {
  title: string
  description: string
  price: number
  pricePerSqft?: number
  listingType: ListingType
  propertyType: PropertyType
  condition?: PropertyCondition
  bedrooms?: number
  bathrooms?: number
  balconies?: number
  floor?: number
  totalFloors?: number
  area?: number
  carpetArea?: number
  builtUpArea?: number
  furnishing?: FurnishingType
  facing?: string
  city: string
  locality: string
  state: string
  pincode?: string
  latitude: number
  longitude: number
  projectId?: string
  amenityIds?: string[]
  images?: ListingImageInput[]
}

export interface UpdateListingInput {
  title?: string
  description?: string
  price?: number
  pricePerSqft?: number
  listingType?: ListingType
  propertyType?: PropertyType
  condition?: PropertyCondition
  status?: ListingStatus
  bedrooms?: number
  bathrooms?: number
  balconies?: number
  floor?: number
  totalFloors?: number
  area?: number
  carpetArea?: number
  builtUpArea?: number
  furnishing?: FurnishingType
  facing?: string
  city?: string
  locality?: string
  state?: string
  pincode?: string
  latitude?: number
  longitude?: number
  isFeatured?: boolean
}

export interface ListingListInput {
  page?: number
  limit?: number
  search?: string
  city?: string
  locality?: string
  listingType?: ListingType
  propertyType?: PropertyType
  status?: ListingStatus
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  ownerId?: string
  projectId?: string
  isFeatured?: boolean
  isVerified?: boolean
  sortBy?: string
  sortOrder?: string
}

export interface ListingImage {
  id: string
  listingId: string
  url: string
  isPrimary: boolean
  order: number
  createdAt?: string
}

export interface AmenityOnListing {
  id: string
  listingId: string
  amenityId: string
  isHighlighted: boolean
  amenity?: { id: string; name: string; icon?: string; category: string }
}

export interface Listing {
  id: string
  title: string
  slug: string
  description: string
  price: number
  pricePerSqft?: number
  listingType: ListingType
  propertyType: PropertyType
  condition?: PropertyCondition
  status: ListingStatus
  bedrooms?: number
  bathrooms?: number
  balconies?: number
  floor?: number
  totalFloors?: number
  area?: number
  carpetArea?: number
  builtUpArea?: number
  furnishing?: FurnishingType
  facing?: string
  city: string
  locality: string
  state: string
  pincode?: string
  latitude: number
  longitude: number
  isVerified: boolean
  isFeatured: boolean
  views: number
  clicks: number
  ownerId: string
  projectId?: string
  createdAt: string
  updatedAt: string
  images?: ListingImage[]
  amenities?: AmenityOnListing[]
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ListingListResponse {
  data: Listing[]
  pagination: Pagination
}
