import { useSocket } from "@/hooks/useSocket"
import { useSocketEvent } from "@/hooks/useSocketEvent"

/** Payload your backend can send for live DB updates (customize to match backend). */
export interface LiveUpdatePayload {
  entity: string
  id: string
  action: "created" | "updated" | "deleted"
  data?: unknown
}

export const LIVE_UPDATE_EVENT = "live:update"

/**
 * Subscribe to live database updates. When the server emits the event (e.g. after a
 * DB change), onUpdate is called so you can refetch queries or update local state.
 * Event name is configurable to match your backend.
 */
export function useLiveUpdate(
  onUpdate: (payload: LiveUpdatePayload) => void,
  eventName: string = LIVE_UPDATE_EVENT,
): void {
  const { socket } = useSocket()
  useSocketEvent(socket, eventName, onUpdate)
}
