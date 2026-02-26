import { useEffect, useRef } from "react"
import type { Socket } from "socket.io-client"

/**
 * Subscribe to a Socket.IO event. Callback is ref-based so you don't need useCallback.
 * Cleans up on unmount or when socket/event change.
 */
export function useSocketEvent<T>(
  socket: Socket | null,
  event: string,
  callback: (data: T) => void,
): void {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!socket) return
    const handler = (data: T) => callbackRef.current(data)
    socket.on(event, handler)
    return () => {
      socket.off(event, handler)
    }
  }, [socket, event])
}
