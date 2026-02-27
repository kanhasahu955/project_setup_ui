import type { ApiSuccessResponse } from "@/@types/client.type"
import { get } from "@/utils/request.util"

export interface GeocodeResult {
  formattedAddress: string
  latitude: number
  longitude: number
  city?: string
  locality?: string
  state?: string
  pincode?: string
}

export interface AutocompletePrediction {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

export interface PlaceDetails {
  placeId: string
  formattedAddress: string
  latitude: number
  longitude: number
  city?: string
  locality?: string
  state?: string
  pincode?: string
}

/** Address autocomplete (city, pincode, state, full address). Requires backend Google Maps API key. */
export async function addressAutocomplete(input: string): Promise<AutocompletePrediction[]> {
  if (!input?.trim()) return []
  const res = await get<ApiSuccessResponse<{ predictions: AutocompletePrediction[] }>>(
    "/maps/autocomplete",
    { input: input.trim() },
  )
  if (!res?.success || !res.data) return []
  return res.data.predictions ?? []
}

/** Get place details by place_id; fills city, locality, state, pincode, lat, lng. */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const res = await get<ApiSuccessResponse<PlaceDetails>>("/maps/place-details", {
    placeId,
  })
  if (!res?.success || !res.data) {
    throw new Error(res?.message ?? "Could not get place details")
  }
  return res.data
}

/** Reverse geocode: get address from lat/lng. Requires backend Google Maps API key. */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const res = await get<ApiSuccessResponse<GeocodeResult>>("/maps/geocode", {
    lat: String(lat),
    lng: String(lng),
  })
  if (!res?.success || !res.data) {
    throw new Error(res?.message ?? "Could not get address for location")
  }
  return res.data
}
