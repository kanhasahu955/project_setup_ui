import { createContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"
import { resolveSocketUrl } from "@/constants"

export type SocketContextValue = {
  socket: Socket | null
  connected: boolean
}

export const SocketContext = createContext<SocketContextValue | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<SocketContextValue["socket"]>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const url = resolveSocketUrl()
    const client = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    client.on("connect", onConnect)
    client.on("disconnect", onDisconnect)

    queueMicrotask(() => setSocket(client))
    return () => {
      client.off("connect", onConnect)
      client.off("disconnect", onDisconnect)
      client.disconnect()
      setSocket(null)
      setConnected(false)
    }
  }, [])

  const value = useMemo<SocketContextValue>(
    () => ({ socket, connected }),
    [socket, connected],
  )

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
