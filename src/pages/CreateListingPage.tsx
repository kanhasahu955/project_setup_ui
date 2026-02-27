import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select } from 'antd'
import { useAppDispatch } from '@/store/hooks'
import { createListing as createListingThunk } from '@/store/actions/listing.action'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { FormField, Button } from '@/components/ui'
import { PATHS, pathListingDetail } from '@/routes/paths'
import type { CreateListingInput } from '@/@types/listing.type'
import {
  LISTING_TYPE,
  PROPERTY_TYPE,
  PROPERTY_CONDITION,
  FURNISHING_TYPE,
} from '@/@types/listing.type'

const inputClassName =
  'h-9 w-full min-h-[36px] text-sm rounded-lg border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 [&_input]:w-full [&_input]:h-full [&_input]:text-sm [&_input]:bg-transparent [&_input]:text-slate-900 [&_input]:rounded-lg'

const listingTypeOptions = Object.entries(LISTING_TYPE).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const propertyTypeOptions = Object.entries(PROPERTY_TYPE).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const conditionOptions = Object.entries(PROPERTY_CONDITION).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))
const furnishingOptions = Object.entries(FURNISHING_TYPE).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))

export function CreateListingPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<CreateListingInput & { pricePerSqft?: number }>()

  const onFinish = useCallback(
    (values: CreateListingInput & { pricePerSqft?: number }) => {
      const { pricePerSqft, ...rest } = values
      const input: CreateListingInput = {
        ...rest,
        ...(pricePerSqft != null && pricePerSqft > 0 ? { pricePerSqft } : {}),
        latitude: values.latitude ?? 0,
        longitude: values.longitude ?? 0,
      }
      setLoading(true)
      dispatch(createListingThunk(input))
        .unwrap()
        .then((listing) => {
          toastStore.getState().showSuccess('Listing created successfully.')
          navigate(pathListingDetail(listing.id))
        })
        .catch((msg: unknown) => {
          const message = typeof msg === 'string' ? msg : 'Failed to create listing'
          toastStore.getState().showError(message)
        })
        .finally(() => setLoading(false))
    },
    [dispatch, navigate],
  )

  return (
    <>
      <SEO
        title="Create Listing"
        description="Add a new property listing on Live Bhoomi."
        canonical={PATHS.LISTINGS_CREATE}
        noIndex
      />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold mb-6 text-slate-900">Create listing</h1>
          <section className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={onFinish}
              className="[&_.ant-form-item-label>label]:text-slate-700"
              initialValues={{
                listingType: LISTING_TYPE.SALE,
                propertyType: PROPERTY_TYPE.APARTMENT,
                latitude: 0,
                longitude: 0,
              }}
            >
              <FormField
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Enter title' }]}
              >
                <Input placeholder="e.g. 2 BHK Apartment in Koramangala" className={inputClassName} />
              </FormField>
              <FormField
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Enter description' }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Describe the property…"
                  className={inputClassName}
                />
              </FormField>
              <FormField
                label="Price (₹)"
                name="price"
                rules={[{ required: true, message: 'Enter price' }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="0"
                  addonBefore="₹"
                  controls={false}
                />
              </FormField>
              <FormField label="Price per sqft (optional)" name="pricePerSqft">
                <InputNumber min={0} className="w-full" placeholder="0" controls={false} />
              </FormField>
              <FormField
                label="Listing type"
                name="listingType"
                rules={[{ required: true }]}
              >
                <Select options={listingTypeOptions} className="w-full" />
              </FormField>
              <FormField
                label="Property type"
                name="propertyType"
                rules={[{ required: true }]}
              >
                <Select options={propertyTypeOptions} className="w-full" />
              </FormField>
              <FormField label="Condition" name="condition">
                <Select options={conditionOptions} allowClear placeholder="Select" className="w-full" />
              </FormField>
              <FormField label="Bedrooms" name="bedrooms">
                <InputNumber min={0} className="w-full" placeholder="0" />
              </FormField>
              <FormField label="Bathrooms" name="bathrooms">
                <InputNumber min={0} className="w-full" placeholder="0" />
              </FormField>
              <FormField label="Area (sqft)" name="area">
                <InputNumber min={0} className="w-full" placeholder="0" />
              </FormField>
              <FormField label="Furnishing" name="furnishing">
                <Select options={furnishingOptions} allowClear placeholder="Select" className="w-full" />
              </FormField>
              <FormField
                label="City"
                name="city"
                rules={[{ required: true, message: 'Enter city' }]}
              >
                <Input placeholder="e.g. Bangalore" className={inputClassName} />
              </FormField>
              <FormField
                label="Locality"
                name="locality"
                rules={[{ required: true, message: 'Enter locality' }]}
              >
                <Input placeholder="e.g. Koramangala" className={inputClassName} />
              </FormField>
              <FormField
                label="State"
                name="state"
                rules={[{ required: true, message: 'Enter state' }]}
              >
                <Input placeholder="e.g. Karnataka" className={inputClassName} />
              </FormField>
              <FormField label="Pincode" name="pincode">
                <Input placeholder="e.g. 560034" className={inputClassName} />
              </FormField>
              <FormField
                label="Latitude"
                name="latitude"
                rules={[{ required: true, message: 'Enter latitude' }]}
              >
                <InputNumber className="w-full" placeholder="0" />
              </FormField>
              <FormField
                label="Longitude"
                name="longitude"
                rules={[{ required: true, message: 'Enter longitude' }]}
              >
                <InputNumber className="w-full" placeholder="0" />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  className="h-9 font-medium bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? 'Creating…' : 'Create listing'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate(PATHS.LISTINGS)}
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
