import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { useAppDispatch } from '@/store/hooks'
import { deleteListing as deleteListingThunk } from '@/store/actions/listing.action'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { PATHS, pathListingDetail, pathListingEdit } from '@/routes/paths'
import { LISTING } from '@/graphql/operations'

interface ListingDetailItem {
  id: string
  title: string
  slug: string
  description: string
  price: number
  pricePerSqft?: number
  listingType: string
  propertyType: string
  condition?: string
  status: string
  bedrooms?: number
  bathrooms?: number
  balconies?: number
  floor?: number
  totalFloors?: number
  area?: number
  carpetArea?: number
  builtUpArea?: number
  furnishing?: string
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
  createdAt: string
  updatedAt: string
  images?: Array<{ id: string; url: string; isPrimary: boolean; order: number }>
  amenities?: Array<{
    id: string
    isHighlighted: boolean
    amenity?: { id: string; name: string; icon?: string; category: string }
  }>
}

interface ListingDetailData {
  listing?: ListingDetailItem | null
  data?: { listing?: ListingDetailItem | null }
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { data, loading, error } = useQuery<ListingDetailData>(LISTING, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const listing = data?.data?.listing ?? data?.listing

  const handleDelete = () => {
    if (!id || !window.confirm('Delete this listing?')) return
    dispatch(deleteListingThunk(id))
      .unwrap()
      .then((res) => {
        toastStore.getState().showSuccess(res.message ?? 'Listing deleted.')
        navigate(PATHS.LISTINGS)
      })
      .catch((msg: unknown) => {
        const message = typeof msg === 'string' ? msg : 'Failed to delete listing'
        toastStore.getState().showError(message)
      })
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Invalid listing ID.</p>
      </div>
    )
  }

  if (loading && !listing) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-red-400">{error?.message ?? 'Listing not found.'}</p>
        <Link to={PATHS.LISTINGS} className="mt-4 text-indigo-400 text-sm hover:text-indigo-300">
          Back to listings
        </Link>
      </div>
    )
  }

  const primaryImage = listing.images?.find((i) => i.isPrimary) ?? listing.images?.[0]
  const otherImages = listing.images?.filter((i) => i.url !== primaryImage?.url) ?? []

  return (
    <>
      <SEO
        title={listing.title}
        description={listing.description?.slice(0, 160) ?? 'Property listing on Live Bhoomi.'}
        canonical={pathListingDetail(listing.id)}
      />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <Link to={PATHS.LISTINGS} className="text-slate-400 text-sm hover:text-slate-300">
              ← Back to listings
            </Link>
            <div className="flex gap-2">
              <Link
                to={pathListingEdit(listing.id)}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-900/50 px-3 py-1.5 text-sm font-medium hover:bg-red-800/50"
              >
                Delete
              </button>
            </div>
          </div>

          <article className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden">
            {primaryImage && (
              <div className="aspect-video bg-slate-800">
                <img
                  src={primaryImage.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {otherImages.length > 0 && (
              <div className="flex gap-2 p-2 overflow-x-auto border-b border-slate-800">
                {otherImages.slice(0, 5).map((img) => (
                  <div
                    key={img.id}
                    className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-800"
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <div className="p-6">
              <h1 className="text-xl font-semibold text-white">{listing.title}</h1>
              <p className="text-indigo-400 text-lg mt-1">
                ₹ {listing.price.toLocaleString()}
                {listing.area != null && (
                  <span className="text-slate-400 text-sm font-normal ml-2">
                    ({listing.area} sqft
                    {listing.pricePerSqft != null && ` · ₹${listing.pricePerSqft}/sqft`})
                  </span>
                )}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                {[listing.locality, listing.city, listing.state].filter(Boolean).join(', ')}
                {listing.pincode && ` ${listing.pincode}`}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {listing.listingType}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {listing.propertyType}
                </span>
                {listing.bedrooms != null && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                    {listing.bedrooms} BHK
                  </span>
                )}
                {listing.status && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                    {listing.status}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm mt-4 whitespace-pre-wrap">{listing.description}</p>
              {(listing.bedrooms != null || listing.bathrooms != null || listing.area != null) && (
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
                  {listing.bedrooms != null && (
                    <>
                      <dt className="text-slate-500 text-xs">Bedrooms</dt>
                      <dd className="text-slate-300 text-sm">{listing.bedrooms}</dd>
                    </>
                  )}
                  {listing.bathrooms != null && (
                    <>
                      <dt className="text-slate-500 text-xs">Bathrooms</dt>
                      <dd className="text-slate-300 text-sm">{listing.bathrooms}</dd>
                    </>
                  )}
                  {listing.area != null && (
                    <>
                      <dt className="text-slate-500 text-xs">Area</dt>
                      <dd className="text-slate-300 text-sm">{listing.area} sqft</dd>
                    </>
                  )}
                </dl>
              )}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h3 className="text-slate-400 text-xs font-medium mb-2">Amenities</h3>
                  <ul className="flex flex-wrap gap-2">
                    {listing.amenities.map((a) => (
                      <li
                        key={a.id}
                        className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded"
                      >
                        {a.amenity?.name ?? '—'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-slate-500 text-xs mt-4">
                {listing.views} views · {listing.clicks} clicks · Updated {listing.updatedAt}
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
