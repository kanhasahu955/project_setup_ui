import { useState } from 'react'
import { Modal } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteListing as deleteListingThunk } from '@/store/actions/listing.action'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { ChatPanel } from '@/components/chat'
import { Button } from '@/components/ui'
import { PATHS, pathListingDetail, pathListingEdit } from '@/routes/paths'
import {
  LISTING,
  LISTINGS,
  MY_LISTINGS,
  LISTING_COMMENTS,
  LISTING_REVIEWS,
  ADD_LISTING_FAVORITE,
  REMOVE_LISTING_FAVORITE,
  CREATE_LISTING_COMMENT,
  DELETE_LISTING_COMMENT,
  CREATE_LISTING_REVIEW,
  UPDATE_LISTING_REVIEW,
  DELETE_LISTING_REVIEW,
} from '@/graphql/operations'
import { StarRatingDisplay, StarRatingInput } from '@/components/listing/StarRating'

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
  favoritesCount?: number
  isFavoritedByMe?: boolean
  averageRating?: number | null
  totalRatings?: number | null
  isRatedByMe?: boolean
  myRating?: number | null
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
  const user = useAppSelector((s) => s.auth.user)
  const [chatOpen, setChatOpen] = useState(false)

  const { data, loading, error } = useQuery<ListingDetailData>(LISTING, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const listing = data?.data?.listing ?? data?.listing

  const { data: commentsData } = useQuery<{
    listingComments?: Array<{
      id: string
      listingId: string
      userId: string
      content: string
      createdAt: string
      user?: { id: string; name?: string; email?: string }
    }>
    data?: { listingComments?: Array<{
      id: string
      listingId: string
      userId: string
      content: string
      createdAt: string
      user?: { id: string; name?: string; email?: string }
    }> }
  }>(LISTING_COMMENTS, {
    variables: { listingId: id ?? '' },
    skip: !id,
  })
  const commentsResult = commentsData?.data?.listingComments ?? commentsData?.listingComments
  const comments = Array.isArray(commentsResult) ? commentsResult : []

  const [addFavorite] = useMutation(ADD_LISTING_FAVORITE, {
    refetchQueries: [
      { query: LISTING, variables: { id: id ?? '' } },
      { query: LISTINGS, variables: { input: { page: 1, limit: 20 } } },
      { query: MY_LISTINGS, variables: { input: { page: 1, limit: 20 } } },
    ],
  })
  const [removeFavorite] = useMutation(REMOVE_LISTING_FAVORITE, {
    refetchQueries: [
      { query: LISTING, variables: { id: id ?? '' } },
      { query: LISTINGS, variables: { input: { page: 1, limit: 20 } } },
      { query: MY_LISTINGS, variables: { input: { page: 1, limit: 20 } } },
    ],
  })
  const [createComment] = useMutation(CREATE_LISTING_COMMENT, {
    refetchQueries: [{ query: LISTING_COMMENTS, variables: { listingId: id ?? '' } }],
  })
  const [deleteComment] = useMutation(DELETE_LISTING_COMMENT, {
    refetchQueries: [{ query: LISTING_COMMENTS, variables: { listingId: id ?? '' } }],
  })

  const [commentText, setCommentText] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [ratingSubmitting, setRatingSubmitting] = useState(false)

  const { data: reviewsData } = useQuery<{
    listingReviews?: Array<{
      id: string
      listingId: string
      userId: string
      rating: number
      comment?: string | null
      createdAt: string
      user?: { id: string; name?: string }
    }>
    data?: { listingReviews?: Array<{
      id: string
      listingId: string
      userId: string
      rating: number
      comment?: string | null
      createdAt: string
      user?: { id: string; name?: string }
    }> }
  }>(LISTING_REVIEWS, { variables: { listingId: id ?? '' }, skip: !id })
  const reviewsResult = reviewsData?.data?.listingReviews ?? reviewsData?.listingReviews
  const reviews = Array.isArray(reviewsResult) ? reviewsResult : []
  const myReview = reviews.find((r) => r.userId === user?.id)

  const [createReview] = useMutation(CREATE_LISTING_REVIEW, {
    refetchQueries: [
      { query: LISTING, variables: { id: id ?? '' } },
      { query: LISTING_REVIEWS, variables: { listingId: id ?? '' } },
      { query: LISTINGS, variables: { input: { page: 1, limit: 20 } } },
      { query: MY_LISTINGS, variables: { input: { page: 1, limit: 20 } } },
    ],
  })
  const [updateReview] = useMutation(UPDATE_LISTING_REVIEW, {
    refetchQueries: [
      { query: LISTING, variables: { id: id ?? '' } },
      { query: LISTING_REVIEWS, variables: { listingId: id ?? '' } },
      { query: LISTINGS, variables: { input: { page: 1, limit: 20 } } },
      { query: MY_LISTINGS, variables: { input: { page: 1, limit: 20 } } },
    ],
  })
  const [removeReview] = useMutation(DELETE_LISTING_REVIEW, {
    refetchQueries: [
      { query: LISTING, variables: { id: id ?? '' } },
      { query: LISTING_REVIEWS, variables: { listingId: id ?? '' } },
      { query: LISTINGS, variables: { input: { page: 1, limit: 20 } } },
      { query: MY_LISTINGS, variables: { input: { page: 1, limit: 20 } } },
    ],
  })

  const handleToggleFavorite = () => {
    if (!id || !user) return
    const isFav = (listing as { isFavoritedByMe?: boolean })?.isFavoritedByMe
    if (isFav) {
      removeFavorite({ variables: { listingId: id } })
        .then(() => toastStore.getState().showSuccess('Removed from favorites.'))
        .catch(() => toastStore.getState().showError('Failed to remove favorite.'))
    } else {
      addFavorite({ variables: { listingId: id } })
        .then(() => toastStore.getState().showSuccess('Added to favorites.'))
        .catch(() => toastStore.getState().showError('Failed to add favorite.'))
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!id || !text || !user) return
    setCommentSubmitting(true)
    createComment({ variables: { listingId: id, content: text } })
      .then(() => {
        setCommentText('')
        toastStore.getState().showSuccess('Comment added.')
      })
      .catch(() => toastStore.getState().showError('Failed to add comment.'))
      .finally(() => setCommentSubmitting(false))
  }

  const handleDeleteComment = (commentId: string) => {
    deleteComment({ variables: { id: commentId } })
      .then(() => toastStore.getState().showSuccess('Comment deleted.'))
      .catch(() => toastStore.getState().showError('Failed to delete comment.'))
  }

  const handleRate = (rating: number) => {
    if (!id || !user) return
    setRatingSubmitting(true)
    if (myReview) {
      updateReview({ variables: { id: myReview.id, rating, comment: myReview.comment ?? null } })
        .then(() => toastStore.getState().showSuccess('Rating updated.'))
        .catch(() => toastStore.getState().showError('Failed to update rating.'))
        .finally(() => setRatingSubmitting(false))
    } else {
      createReview({ variables: { listingId: id, rating } })
        .then(() => toastStore.getState().showSuccess('Thanks for your rating!'))
        .catch(() => toastStore.getState().showError('Failed to submit rating.'))
        .finally(() => setRatingSubmitting(false))
    }
  }

  const handleRemoveRating = () => {
    if (!myReview) return
    removeReview({ variables: { id: myReview.id } })
      .then(() => toastStore.getState().showSuccess('Rating removed.'))
      .catch(() => toastStore.getState().showError('Failed to remove rating.'))
  }

  const handleDelete = () => {
    if (!id) return
    Modal.confirm({
      title: 'Delete this listing?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: () =>
        dispatch(deleteListingThunk(id))
          .unwrap()
          .then((res) => {
            toastStore.getState().showSuccess(res.message ?? 'Listing deleted.')
            navigate(PATHS.LISTINGS)
          })
          .catch((msg: unknown) => {
            const message = typeof msg === 'string' ? msg : 'Failed to delete listing'
            toastStore.getState().showError(message)
          }),
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
            <div className="flex gap-2 flex-wrap">
              {user && (
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600 flex items-center gap-1.5"
                  title={(listing as { isFavoritedByMe?: boolean })?.isFavoritedByMe ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className="text-base">
                    {(listing as { isFavoritedByMe?: boolean })?.isFavoritedByMe ? '❤️' : '🤍'}
                  </span>
                  <span>{(listing as { favoritesCount?: number })?.favoritesCount ?? 0}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setChatOpen((o) => !o)}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600"
              >
                {chatOpen ? 'Hide chat' : 'Chat'}
              </button>
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
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <StarRatingDisplay
                  rating={listing.averageRating}
                  totalRatings={listing.totalRatings ?? undefined}
                />
                {user && (
                  <span className="text-slate-500 text-sm inline-flex items-center gap-2">
                    {listing.isRatedByMe ? 'Your rating:' : 'Rate this property:'}
                    <StarRatingInput
                      value={listing.myRating ?? myReview?.rating ?? 0}
                      onChange={handleRate}
                      disabled={ratingSubmitting}
                    />
                    {listing.isRatedByMe && (
                      <button
                        type="button"
                        onClick={handleRemoveRating}
                        className="text-slate-400 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </span>
                )}
              </div>
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
              {reviews.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h3 className="text-slate-400 text-xs font-medium mb-2">Recent ratings</h3>
                  <ul className="space-y-2">
                    {reviews.slice(0, 5).map((r) => (
                      <li key={r.id} className="flex items-start gap-2 text-sm">
                        <StarRatingDisplay rating={r.rating} size="sm" />
                        <span className="text-slate-400">{r.user?.name ?? 'User'}</span>
                        {r.comment && <span className="text-slate-300">· {r.comment}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
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

          {/* Comments */}
          <section className="mt-6 rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-sm font-medium text-white">Comments ({comments.length})</h2>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-slate-500 text-sm">No comments yet. Be the first to comment.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex justify-between gap-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-400 text-xs">{c.user?.name ?? c.user?.email ?? 'User'}</p>
                    <p className="text-slate-200 whitespace-pre-wrap">{c.content}</p>
                  </div>
                  {user?.id === c.userId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-slate-500 hover:text-red-400 text-xs shrink-0"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
            {user ? (
              <form onSubmit={handleSubmitComment} className="p-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment…"
                    disabled={commentSubmitting}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                  />
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={commentSubmitting || !commentText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Post
                  </Button>
                </div>
              </form>
            ) : (
              <p className="p-4 border-t border-slate-800 text-slate-500 text-sm">
                <Link to={PATHS.LOGIN} className="text-indigo-400 hover:text-indigo-300">Sign in</Link> to comment.
              </p>
            )}
          </section>

          {chatOpen && (
            <section className="mt-6">
              <ChatPanel
                roomId={listing.id}
                title={`Chat: ${listing.title}`}
                currentUserId={user?.id}
                currentUserName={user?.name}
              />
            </section>
          )}
        </div>
      </div>
    </>
  )
}
