import { useEffect, useRef } from "react"
import { App } from "antd"
import { useToastStore } from "@/store/toast.store"

export function ToastListener() {
  const toast = useToastStore((s) => s.toast)
  const clear = useToastStore((s) => s.clear)
  const { message: messageApi } = App.useApp()
  const prevToastRef = useRef<typeof toast>(null)

  useEffect(() => {
    if (toast === null || toast === prevToastRef.current) return
    prevToastRef.current = toast
    messageApi[toast.type](toast.message)
    clear()
  }, [toast, clear, messageApi])

  return null
}
