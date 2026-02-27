import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AutoComplete, Form, Input, InputNumber, Select } from 'antd'
import { useAppDispatch } from '@/store/hooks'
import { createListing as createListingThunk } from '@/store/actions/listing.action'
import { toastStore } from '@/store/toast.store'
import { SEO } from '@/components/SEO'
import { FormField, Button } from '@/components/ui'
import { PATHS, pathListingDetail } from '@/routes/paths'
import type { CreateListingInput, ListingImageInput } from '@/@types/listing.type'
import {
  LISTING_TYPE,
  PROPERTY_TYPE,
  PROPERTY_CONDITION,
  FURNISHING_TYPE,
} from '@/@types/listing.type'
import { uploadListingImages } from '@/services/image.service'
import {
  addressAutocomplete,
  getPlaceDetails,
  reverseGeocode,
} from '@/services/maps.service'
import type { AutocompletePrediction } from '@/services/maps.service'

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
  const [uploadingImages, setUploadingImages] = useState(false)
  const [images, setImages] = useState<ListingImageInput[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [addressSearch, setAddressSearch] = useState('')
  const [addressOptions, setAddressOptions] = useState<AutocompletePrediction[]>([])
  const [addressOptionsLoading, setAddressOptionsLoading] = useState(false)
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [form] = Form.useForm<CreateListingInput & { pricePerSqft?: number }>()

  const onFinish = useCallback(
    (values: CreateListingInput & { pricePerSqft?: number; __images?: unknown }) => {
      const { pricePerSqft, __images: _omitImages, ...rest } = values
      const input: CreateListingInput = {
        ...rest,
        ...(pricePerSqft != null && pricePerSqft > 0 ? { pricePerSqft } : {}),
        latitude: values.latitude ?? 0,
        longitude: values.longitude ?? 0,
        ...(images.length ? { images } : {}),
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
    [dispatch, navigate, images],
  )

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    e.target.value = ''
    setUploadingImages(true)
    try {
      const uploaded = await uploadListingImages(files)
      if (!uploaded.length) {
        toastStore.getState().showError('Image upload failed. Please try again.')
        return
      }
      setImages((prev) => {
        const startOrder = prev.length
        const next = uploaded.map((img, index) => ({
          url: img.url,
          isPrimary: prev.length === 0 && index === 0,
          order: startOrder + index,
        }))
        return [...prev, ...next]
      })
      toastStore.getState().showSuccess('Images uploaded successfully.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload images'
      toastStore.getState().showError(message)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    )
  }

  useEffect(() => {
    if (!addressSearch.trim()) {
      setAddressOptions([])
      return
    }
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current)
    addressDebounceRef.current = setTimeout(async () => {
      setAddressOptionsLoading(true)
      try {
        const list = await addressAutocomplete(addressSearch)
        setAddressOptions(list)
      } catch {
        setAddressOptions([])
      } finally {
        setAddressOptionsLoading(false)
      }
    }, 300)
    return () => {
      if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current)
    }
  }, [addressSearch])

  const handleAddressSelect = async (placeId: string) => {
    try {
      const details = await getPlaceDetails(placeId)
      form.setFieldsValue({
        city: details.city ?? '',
        locality: details.locality ?? details.city ?? '',
        state: details.state ?? '',
        pincode: details.pincode ?? '',
        latitude: details.latitude,
        longitude: details.longitude,
      })
      setAddressSearch(details.formattedAddress)
      toastStore.getState().showSuccess('Address details filled.')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load place details.'
      toastStore.getState().showError(message)
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toastStore.getState().showError('Geolocation is not supported by your browser.')
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const data = await reverseGeocode(latitude, longitude)
          form.setFieldsValue({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city ?? '',
            locality: data.locality ?? data.city ?? '',
            state: data.state ?? '',
            pincode: data.pincode ?? '',
          })
          toastStore.getState().showSuccess('Location filled from your device.')
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Could not get address for your location.'
          toastStore.getState().showError(message)
        } finally {
          setLocationLoading(false)
        }
      },
      (err) => {
        setLocationLoading(false)
        if (err.code === err.PERMISSION_DENIED) {
          toastStore.getState().showError('Location access denied. Allow location to auto-fill address.')
        } else {
          toastStore.getState().showError('Could not get your location. Try again or enter manually.')
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

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
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2">Location</label>
                <AutoComplete
                  value={addressSearch}
                  onChange={(v) => setAddressSearch(typeof v === 'string' ? v : '')}
                  onSelect={(value) => handleAddressSelect(value)}
                  options={addressOptions.map((p) => ({
                    value: p.placeId,
                    label: (
                      <div className="py-1">
                        <div className="font-medium text-slate-900">{p.mainText}</div>
                        {p.secondaryText && (
                          <div className="text-xs text-slate-500">{p.secondaryText}</div>
                        )}
                      </div>
                    ),
                  }))}
                  className={`w-full mb-2 ${inputClassName}`}
                  placeholder="Type city, pincode, state or full address…"
                  notFoundContent={addressOptionsLoading ? 'Searching…' : null}
                  allowClear
                />
                <Button
                  type="default"
                  htmlType="button"
                  onClick={handleUseMyLocation}
                  loading={locationLoading}
                  disabled={locationLoading}
                  className="h-9 mb-2"
                  icon={<span className="text-base" aria-hidden>📍</span>}
                >
                  Use my location
                </Button>
                <p className="text-slate-500 text-xs">
                  Search by address or use your device location to fill city, locality, state, pincode and coordinates.
                </p>
              </div>
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
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2">Images</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                      <span
                        className={`inline-flex items-center h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:bg-slate-100 ${uploadingImages ? 'opacity-60 pointer-events-none' : ''}`}
                      >
                        {uploadingImages ? 'Uploading…' : 'Choose files'}
                      </span>
                    </label>
                    <span className="text-slate-500 text-xs">Uploads to ImageKit and are saved with the listing.</span>
                  </div>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((img, index) => (
                        <div key={img.url + index} className="relative border border-slate-200 rounded-lg overflow-hidden">
                          <img src={img.url} alt="" className="w-full h-24 object-cover" />
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-1.5 py-1">
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(index)}
                              className={`text-[11px] px-1.5 py-0.5 rounded ${
                                img.isPrimary ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-100'
                              }`}
                            >
                              {img.isPrimary ? 'Primary' : 'Make primary'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="text-[11px] text-red-300 hover:text-red-100"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
