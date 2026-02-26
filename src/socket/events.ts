/**
 * Socket event names and payload types. Align with your backend.
 * Use these constants so frontend and backend stay in sync.
 */

/** Rooms: client emits to join/leave (backend listens). */
export const SOCKET_JOIN_ROOM = "joinRoom"
export const SOCKET_LEAVE_ROOM = "leaveRoom"

/** Live DB updates: server emits (client subscribes with useLiveUpdate). */
export const SOCKET_LIVE_UPDATE = "live:update"

/** Chat: client emits message/typing; server broadcasts to room. */
export const SOCKET_MESSAGE = "message"
export const SOCKET_TYPING = "typing"
