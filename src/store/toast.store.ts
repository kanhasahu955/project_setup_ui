import { create } from "zustand"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastPayload {
  readonly type: ToastType
  readonly message: string
}

interface ToastState {
  readonly toast: ToastPayload | null
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
  show: (payload: ToastPayload) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showSuccess: (message) => set({ toast: { type: "success", message } }),
  showError: (message) => set({ toast: { type: "error", message } }),
  showInfo: (message) => set({ toast: { type: "info", message } }),
  showWarning: (message) => set({ toast: { type: "warning", message } }),
  show: (payload) => set({ toast: payload }),
  clear: () => set({ toast: null }),
}))

export const toastStore = useToastStore
