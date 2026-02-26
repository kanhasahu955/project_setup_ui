import { useEffect } from "react"
import { useSocket } from "@/hooks/useSocket"
import { SOCKET_JOIN_ROOM, SOCKET_LEAVE_ROOM } from "@/socket/events"

/**
 * Join a room on mount and leave on unmount. Use for scoped live updates or chat
 * (e.g. roomId = listing id, chat channel id). Backend must handle joinRoom/leaveRoom.
 */
export function useSocketRoom(roomId: string | null): void {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket || roomId == null || roomId === "") return
    socket.emit(SOCKET_JOIN_ROOM, roomId)
    return () => {
      socket.emit(SOCKET_LEAVE_ROOM, roomId)
    }
  }, [socket, roomId])
}
