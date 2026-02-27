import { Link } from 'react-router-dom'
import { Modal } from 'antd'
import { useAppDispatch } from '@/store/hooks'
import { deleteListing as deleteListingThunk } from '@/store/actions/listing.action'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { StarRatingDisplay } from '@/components/listing'
import { PATHS, pathListingDetail, pathListingEdit } from '@/routes/paths'
import { LISTINGS } from '@/graphql/operations'
import type { ListingListInput } from '@/@types/listing.type'
import { useQuery } from '@apollo/client/react'

export function ListingsPage() {
  const dispatch = useAppDispatch()
  const input: ListingListInput = { page: 1, limit: 20 }
  type ListingsResult = {
    data: Array<{
      id: string
      title: string
      slug: string
      price: number
      listingType: string
      propertyType: string
      city: string
      locality: string
      status: string
      bedrooms?: number
      bathrooms?: number
      area?: number
      favoritesCount?: number
      isFavoritedByMe?: boolean
      averageRating?: number | null
      totalRatings?: number | null
      images?: Array<{ id: string; url: string; isPrimary: boolean }>
    }>
    pagination: { total: number; page: number; totalPages: number }
  }
  const { data, loading, error, refetch } = useQuery<{
    listings?: ListingsResult
    data?: { listings?: ListingsResult }
  }>(LISTINGS, {
    variables: { input },
    fetchPolicy: 'no-cache',
  })

  // Support both standard Apollo shape (data.listings) and double-wrapped (data.data.listings)
  const listingsResult = data?.data?.listings ?? data?.listings
  const rawData = listingsResult?.data
  const list = Array.isArray(rawData) ? rawData : []
  const pagination = listingsResult?.pagination

  const handleDelete = (listingId: string, title: string) => {
    Modal.confirm({
      title: 'Delete this listing?',
      content: `Are you sure you want to delete “${title}”? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: () =>
        dispatch(deleteListingThunk(listingId))
          .unwrap()
          .then((res) => {
            toastStore.getState().showSuccess(res.message ?? 'Listing deleted.')
            void refetch()
          })
          .catch((msg: unknown) => {
            const message = typeof msg === 'string' ? msg : 'Failed to delete listing'
            toastStore.getState().showError(message)
          }),
    })
  }

  return (
    <>
      <SEO
        title="Listings"
        description="Browse property listings on Live Bhoomi."
        canonical={PATHS.LISTINGS}
      />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Listings</h1>
            <Link
              to={PATHS.LISTINGS_CREATE}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create listing
            </Link>
          </div>

          {loading && list.length === 0 && (
            <p className="text-slate-400 text-sm">Loading…</p>
          )}
          {error && (
            <p className="text-red-400 text-sm" role="alert">
              {error.message}
            </p>
          )}
          {!loading && !error && list.length === 0 && (
            <section className="rounded-xl bg-slate-900/70 border border-slate-800 p-6">
              <p className="text-slate-400 text-sm">No listings yet.</p>
              <Link
                to={PATHS.LISTINGS_CREATE}
                className="mt-3 inline-block text-indigo-400 text-sm hover:text-indigo-300"
              >
                Create your first listing
              </Link>
            </section>
          )}
          {list.length > 0 && (
            <ul className="space-y-3">
              {list.map((item) => {
                const primaryImage = item.images?.find((i) => i.isPrimary) ?? item.images?.[0]
                return (
                  <li key={item.id}>
                    <Link
                      to={pathListingDetail(item.id)}
                      className="block rounded-xl bg-slate-900/70 border border-slate-800 p-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex gap-4">
                        {primaryImage && (
                          <div className="w-24 h-24 rounded-lg bg-slate-800 shrink-0 overflow-hidden">
                            <img
                              src={primaryImage.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h2 className="font-medium text-white truncate">{item.title}</h2>
                          <p className="text-slate-400 text-sm mt-0.5">
                            {[item.locality, item.city].filter(Boolean).join(', ')}
                          </p>
                          <p className="text-indigo-400 text-sm mt-1">
                            ₹ {item.price.toLocaleString()}
                            {item.area != null && ` · ${item.area} sqft`}
                          </p>
                          {(item.averageRating != null || (item.totalRatings != null && item.totalRatings > 0)) && (
                            <StarRatingDisplay
                              rating={item.averageRating ?? undefined}
                              totalRatings={item.totalRatings ?? undefined}
                              size="sm"
                              className="mt-0.5"
                            />
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-block text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                              {item.listingType} · {item.propertyType}
                              {item.bedrooms != null && ` · ${item.bedrooms} BHK`}
                            </span>
                            {(item.favoritesCount != null && item.favoritesCount > 0) && (
                              <span className="text-slate-500 text-xs" title="Favorites">
                                {item.isFavoritedByMe ? '❤️' : '🤍'} {item.favoritesCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="mt-1 flex gap-2">
                      <Link
                        to={pathListingEdit(item.id)}
                        className="text-xs text-slate-400 hover:text-slate-300"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {pagination && pagination.totalPages > 1 && (
            <p className="text-slate-500 text-xs mt-4">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
          )}
        </div>
      </div>
    </>
  )
}
