import { useCallback } from "react"
import { useSocketEmit } from "@/hooks/useSocketEmit"
import { useSocketRoom } from "@/hooks/useSocketRoom"

/** Outgoing chat message (customize to match backend). */
export interface SendMessagePayload {
  roomId: string
  content: string
}

/** Incoming chat message (customize to match backend). */
export interface ChatMessagePayload {
  roomId: string
  content: string
  senderId: string
  senderName?: string
  timestamp: string
}

/** Typing indicator payload (customize to match backend). */
export interface TypingPayload {
  roomId: string
  userId: string
  userName?: string
}

import { SOCKET_MESSAGE, SOCKET_TYPING } from "@/socket/events"

/**
 * Reusable chat room hook: join room, send message, send typing.
 * For receiving messages and typing, use useSocketEvent in the same component:
 *
 *   const { socket } = useSocket()
 *   const { sendMessage, sendTyping } = useChatRoom(roomId)
 *   useSocketEvent(socket, SOCKET_MESSAGE, (msg: ChatMessagePayload) => { ... })
 *   useSocketEvent(socket, SOCKET_TYPING, (payload: TypingPayload) => { ... })
 *
 * Backend is expected to broadcast "message" and "typing" to the room.
 */
export function useChatRoom(roomId: string | null) {
  useSocketRoom(roomId)
  const emit = useSocketEmit()

  const sendMessage = useCallback(
    (content: string) => {
      if (roomId == null || roomId === "") return
      emit(SOCKET_MESSAGE, { roomId, content })
    },
    [emit, roomId],
  )

  const sendTyping = useCallback(() => {
    if (roomId == null || roomId === "") return
    emit(SOCKET_TYPING, { roomId })
  }, [emit, roomId])

  return { sendMessage, sendTyping }
}
