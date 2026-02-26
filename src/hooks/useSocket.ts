import { useContext } from "react"
import { SocketContext } from "@/context/socketContext"

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (ctx == null) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return ctx
}
