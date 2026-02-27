import { useCallback } from "react"
import { useSocketEmit } from "@/hooks/useSocketEmit"
import { useSocketRoom } from "@/hooks/useSocketRoom"

/** Optional sender info to attach to outgoing messages (so room receives it). */
export interface ChatSenderInfo {
  senderId: string
  senderName?: string
}

/** Outgoing chat message (customize to match backend). */
export interface SendMessagePayload {
  roomId: string
  content: string
  senderId?: string
  senderName?: string
  timestamp?: string
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
 * Optionally pass sender so outgoing messages include senderId/senderName/timestamp.
 * For receiving messages and typing, use useSocketEvent in the same component:
 *
 *   const { socket } = useSocket()
 *   const { sendMessage, sendTyping } = useChatRoom(roomId, { sender })
 *   useSocketEvent(socket, SOCKET_MESSAGE, (msg: ChatMessagePayload) => { ... })
 *   useSocketEvent(socket, SOCKET_TYPING, (payload: TypingPayload) => { ... })
 *
 * Backend is expected to broadcast "message" and "typing" to the room.
 */
export function useChatRoom(
  roomId: string | null,
  options?: { sender?: ChatSenderInfo | null },
) {
  useSocketRoom(roomId)
  const emit = useSocketEmit()
  const sender = options?.sender ?? null

  const sendMessage = useCallback(
    (content: string) => {
      if (roomId == null || roomId === "") return
      const payload: SendMessagePayload = {
        roomId,
        content,
        timestamp: new Date().toISOString(),
      }
      if (sender) {
        payload.senderId = sender.senderId
        payload.senderName = sender.senderName
      }
      emit(SOCKET_MESSAGE, payload)
    },
    [emit, roomId, sender],
  )

  const sendTyping = useCallback(() => {
    if (roomId == null || roomId === "") return
    const payload: TypingPayload = { roomId, userId: sender?.senderId ?? "" }
    if (sender?.senderName) payload.userName = sender.senderName
    emit(SOCKET_TYPING, payload)
  }, [emit, roomId, sender])

  return { sendMessage, sendTyping }
}
