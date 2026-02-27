import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, InputNumber, Select } from 'antd'
import { useQuery } from '@apollo/client/react'
import { useAppDispatch } from '@/store/hooks'
import { updateListing as updateListingThunk } from '@/store/actions/listing.action'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { FormField, Button } from '@/components/ui'
import { PATHS, pathListingDetail, pathListingEdit } from '@/routes/paths'
import { LISTING } from '@/graphql/operations'
import type {
  UpdateListingInput,
  ListingType,
  PropertyType,
  PropertyCondition,
  ListingStatus,
  FurnishingType,
} from '@/@types/listing.type'
import {
  LISTING_TYPE,
  PROPERTY_TYPE,
  PROPERTY_CONDITION,
  LISTING_STATUS,
  FURNISHING_TYPE,
} from '@/@types/listing.type'

const inputClassName =
  'h-9 w-full min-h-[36px] text-sm rounded-lg border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 [&_input]:w-full [&_input]:h-full [&_input]:text-sm [&_input]:bg-transparent [&_input]:text-slate-900 [&_input]:rounded-lg'

const listingTypeOptions = Object.entries(LISTING_TYPE).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const propertyTypeOptions = Object.entries(PROPERTY_TYPE).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const conditionOptions = Object.entries(PROPERTY_CONDITION).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const statusOptions = Object.entries(LISTING_STATUS).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const furnishingOptions = Object.entries(FURNISHING_TYPE).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))

interface ListingData {
  id: string
  title?: string
  description?: string
  price?: number
  pricePerSqft?: number
  listingType?: string
  propertyType?: string
  condition?: string
  status?: string
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
  city?: string
  locality?: string
  state?: string
  pincode?: string
  latitude?: number
  longitude?: number
}

interface ListingQueryResult {
  listing?: ListingData | null
  data?: { listing?: ListingData | null }
}

export function EditListingPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const { data, loading: queryLoading, error } = useQuery<ListingQueryResult>(LISTING, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const [form] = Form.useForm<UpdateListingInput>()
  // Support both standard Apollo shape (data.listing) and double-wrapped (data.data.listing)
  const listing = data?.data?.listing ?? data?.listing

  useEffect(() => {
    if (listing && !initialized) {
      form.setFieldsValue({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        pricePerSqft: listing.pricePerSqft,
        listingType: listing.listingType as ListingType | undefined,
        propertyType: listing.propertyType as PropertyType | undefined,
        condition: listing.condition as PropertyCondition | undefined,
        status: listing.status as ListingStatus | undefined,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        balconies: listing.balconies,
        floor: listing.floor,
        totalFloors: listing.totalFloors,
        area: listing.area,
        carpetArea: listing.carpetArea,
        builtUpArea: listing.builtUpArea,
        furnishing: listing.furnishing as FurnishingType | undefined,
        facing: listing.facing,
        city: listing.city,
        locality: listing.locality,
        state: listing.state,
        pincode: listing.pincode,
        latitude: listing.latitude,
        longitude: listing.longitude,
      })
      setInitialized(true)
    }
  }, [listing, form, initialized])

  const onFinish = useCallback(
    (values: UpdateListingInput) => {
      if (!id) return
      setLoading(true)
      dispatch(updateListingThunk({ id, input: values }))
        .unwrap()
        .then(() => {
          toastStore.getState().showSuccess('Listing updated.')
          navigate(pathListingDetail(id))
        })
        .catch((msg: unknown) => {
          const message = typeof msg === 'string' ? msg : 'Failed to update listing'
          toastStore.getState().showError(message)
        })
        .finally(() => setLoading(false))
    },
    [id, dispatch, navigate],
  )

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Invalid listing ID.</p>
      </div>
    )
  }

  if (queryLoading && !listing) {
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
        <Button
          type="default"
          htmlType="button"
          onClick={() => navigate(PATHS.LISTINGS)}
          className="mt-4 text-indigo-400 text-sm hover:text-indigo-300"
        >
          Back to listings
        </Button>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Edit Listing"
        description="Edit property listing on Live Bhoomi."
        canonical={pathListingEdit(id)}
        noIndex
      />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold mb-6 text-slate-900">Edit listing</h1>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={onFinish}
              className="[&_.ant-form-item-label>label]:text-slate-700"
            >
              <FormField
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Enter title' }]}
              >
                <Input placeholder="Title" className={inputClassName} />
              </FormField>
              <FormField
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Enter description' }]}
              >
                <Input.TextArea rows={3} placeholder="Description" className={inputClassName} />
              </FormField>
              <FormField label="Price (₹)" name="price" rules={[{ required: true }]}>
                <InputNumber min={0} className="w-full" addonBefore="₹" controls={false} />
              </FormField>
              <FormField label="Price per sqft" name="pricePerSqft">
                <InputNumber min={0} className="w-full" controls={false} />
              </FormField>
              <FormField label="Listing type" name="listingType">
                <Select options={listingTypeOptions} className="w-full" />
              </FormField>
              <FormField label="Property type" name="propertyType">
                <Select options={propertyTypeOptions} className="w-full" />
              </FormField>
              <FormField label="Condition" name="condition">
                <Select options={conditionOptions} allowClear className="w-full" />
              </FormField>
              <FormField label="Status" name="status">
                <Select options={statusOptions} className="w-full" />
              </FormField>
              <FormField label="Bedrooms" name="bedrooms">
                <InputNumber min={0} className="w-full" />
              </FormField>
              <FormField label="Bathrooms" name="bathrooms">
                <InputNumber min={0} className="w-full" />
              </FormField>
              <FormField label="Area (sqft)" name="area">
                <InputNumber min={0} className="w-full" />
              </FormField>
              <FormField label="Furnishing" name="furnishing">
                <Select options={furnishingOptions} allowClear className="w-full" />
              </FormField>
              <FormField label="City" name="city" rules={[{ required: true }]}>
                <Input className={inputClassName} />
              </FormField>
              <FormField label="Locality" name="locality" rules={[{ required: true }]}>
                <Input className={inputClassName} />
              </FormField>
              <FormField label="State" name="state" rules={[{ required: true }]}>
                <Input className={inputClassName} />
              </FormField>
              <FormField label="Pincode" name="pincode">
                <Input className={inputClassName} />
              </FormField>
              <FormField label="Latitude" name="latitude">
                <InputNumber className="w-full" />
              </FormField>
              <FormField label="Longitude" name="longitude">
                <InputNumber className="w-full" />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  className="h-9 font-medium bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? 'Saving…' : 'Save'}
                </Button>
                <Button
                  type="default"
                  htmlType="button"
                  onClick={() => navigate(pathListingDetail(id))}
                  className="h-9"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </section>
        </div>
      </div>
    </>
  )
}
