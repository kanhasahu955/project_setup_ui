import { useCallback } from "react"
import { useSocket } from "@/hooks/useSocket"

/** Emit function signature: (event, ...args) => void. No-op when socket is disconnected. */
export type SocketEmitFn = (event: string, ...args: unknown[]) => void

/**
 * Return a stable emit function to send events. Safe to call when socket is disconnected
 * (no-op). Use for sending messages, typing indicators, or any client→server event.
 */
export function useSocketEmit(): SocketEmitFn {
  const { socket } = useSocket()

  return useCallback<SocketEmitFn>(
    (event, ...args) => {
      socket?.emit(event, ...args)
    },
    [socket],
  )
}
