import { useCallback, useEffect, useRef, useState } from "react"
import { useSocket } from "@/hooks/useSocket"
import { useSocketEvent } from "@/hooks/useSocketEvent"
import {
  useChatRoom,
  type ChatMessagePayload,
  type TypingPayload,
} from "@/hooks/useChatRoom"
import { SOCKET_MESSAGE, SOCKET_TYPING } from "@/socket/events"

export interface ChatPanelProps {
  /** Room id (e.g. listing id). When null, panel shows "Select a room" or is disabled. */
  roomId: string | null
  /** Display title for the chat (e.g. "Chat about this listing"). */
  title?: string
  /** Current user id – messages with this senderId show as "You". */
  currentUserId?: string | null
  /** Current user display name. */
  currentUserName?: string | null
  /** Optional class for the container. */
  className?: string
}

export function ChatPanel({
  roomId,
  title = "Chat",
  currentUserId = null,
  currentUserName = null,
  className = "",
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([])
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { socket, connected } = useSocket()
  const sender =
    currentUserId != null
      ? { senderId: currentUserId, senderName: currentUserName ?? undefined }
      : null
  const { sendMessage, sendTyping } = useChatRoom(roomId, { sender })

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useSocketEvent(socket, SOCKET_MESSAGE, (msg: ChatMessagePayload) => {
    if (msg.roomId !== roomId) return
    setMessages((prev) => [...prev, { ...msg, senderId: msg.senderId ?? "", timestamp: msg.timestamp ?? new Date().toISOString() }])
  })

  useSocketEvent(socket, SOCKET_TYPING, (payload: TypingPayload) => {
    if (payload.roomId !== roomId || payload.userId === currentUserId) return
    setTypingUser(payload.userName ?? payload.userId ?? "Someone")
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000)
  })

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const text = inputValue.trim()
      if (!text || !roomId) return
      sendMessage(text)
      setInputValue("")
    },
    [inputValue, roomId, sendMessage],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    if (roomId) sendTyping()
  }, [roomId, sendTyping])

  const disabled = !roomId || !connected

  return (
    <div
      className={`flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 text-slate-100 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <span
          className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-500"}`}
          title={connected ? "Connected" : "Disconnected"}
        />
      </div>

      <div className="flex min-h-[200px] max-h-[320px] flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 && !typingUser && (
            <p className="text-center text-slate-500 text-sm py-4">
              {disabled ? "Connect or select a room to chat." : "No messages yet. Say hello!"}
            </p>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.senderId === currentUserId
            return (
              <div
                key={`${msg.timestamp}-${i}`}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-700 text-slate-100"
                  }`}
                >
                  {!isMe && (msg.senderName || msg.senderId) && (
                    <p className="text-xs text-slate-400 mb-0.5">
                      {msg.senderName ?? msg.senderId}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            )
          })}
          {typingUser && (
            <p className="text-slate-500 text-xs italic">{typingUser} is typing…</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-800 p-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={disabled ? "Not connected" : "Type a message…"}
              disabled={disabled}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={disabled || !inputValue.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
