import { forOwn, isArray, isNil } from "@/utils/lodash.util"

export type FormDataValue = string | Blob | File | (Blob | File)[]
export type FormDataPayload = Record<string, FormDataValue>

export function createFormData(payload: FormDataPayload): FormData {
    const formData = new FormData()
    forOwn(payload, (value, key) => {
        if (isNil(value)) return
        if (isArray(value)) {
            for (const item of value) {
                formData.append(key, item)
            }
        } else {
            formData.append(key, value)
        }
    })
    return formData
}
