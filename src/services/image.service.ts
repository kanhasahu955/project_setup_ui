import type { ApiSuccessResponse } from "@/@types/client.type"
import { createFormData } from "@/utils/formData.util"
import { upload } from "@/utils/request.util"

interface ImageUploadResult {
  fileId: string
  name: string
  url: string
  thumbnailUrl?: string
  filePath: string
  fileType: string
  size: number
}

interface BulkImageUploadResult {
  successful: ImageUploadResult[]
  failed: Array<{ fileName: string; error: string }>
}

/** Upload one or more images for property listings. Returns ImageKit URLs. */
export async function uploadListingImages(files: File[]): Promise<ImageUploadResult[]> {
  if (!files.length) return []

  const formData = createFormData({ files })

  const res = await upload<ApiSuccessResponse<BulkImageUploadResult>>(
    "/images/upload/multiple?folder=properties&tags=listings",
    formData,
  )

  if (!res?.success || !res.data) {
    throw new Error(res?.message ?? "Image upload failed")
  }

  return res.data.successful ?? []
}

