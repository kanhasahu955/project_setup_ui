import { resolveAiApiUrl, resolveAiWsUrl } from "@/constants"

const getBase = () => resolveAiApiUrl()

export interface DbStatusCollection {
  name: string
  count: number
}

export interface DbStatus {
  connected: boolean
  database: string
  collections: DbStatusCollection[]
  listingSample?: ListingReference[]
  error?: string
}

/** GET /ai/db-status – connection status, database name, collections (tables) with counts, optional Listing sample. */
export async function getAiDbStatus(): Promise<DbStatus> {
  const res = await fetch(`${getBase()}/ai/db-status`)
  if (!res.ok) {
    return {
      connected: false,
      database: "",
      collections: [],
      error: res.statusText,
    }
  }
  return res.json() as Promise<DbStatus>
}

export interface ListingReference {
  id: string
  title: string
  price: number | null
  city: string
  locality: string
  state: string
  listingType: string
  propertyType: string
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  slug: string
}

export interface ChatResponse {
  reply: string
  references?: ListingReference[]
  steps?: string[]
}

export type StreamEvent =
  | { type: "step"; message: string }
  | { type: "chunk"; content: string }
  | { type: "done"; references: ListingReference[] }
  | { type: "error"; detail: string }

const CHAT_TIMEOUT_MS = 95_000

/** POST /ai/chat – text message, get AI suggestions. Times out after 95s so backend 90s timeout can trigger first. */
export async function aiChat(message: string): Promise<ChatResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS)
  const res = await fetch(`${getBase()}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    signal: controller.signal,
  })
  clearTimeout(timeoutId)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message ?? "AI request failed")
  }
  return res.json() as Promise<ChatResponse>
}

const WS_OPEN_TIMEOUT_MS = 20_000

/** WebSocket /ai/ws – stream step, chunks, then done with references. Same StreamEvent shape. */
export async function* aiChatStreamOverWebSocket(message: string): AsyncGenerator<StreamEvent> {
  const wsUrl = resolveAiWsUrl()
  const ws = new WebSocket(wsUrl)
  const queue: StreamEvent[] = []
  let resolveNext: (() => void) | null = null
  let done = false

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data as string) as {
        type?: string
        message?: string
        content?: string
        references?: ListingReference[]
        detail?: string
      }
      if (data.type === "step" && data.message != null) {
        queue.push({ type: "step", message: data.message })
      } else if (data.type === "chunk" && data.content != null) {
        queue.push({ type: "chunk", content: data.content })
      } else if (data.type === "done") {
        queue.push({ type: "done", references: data.references ?? [] })
        done = true
      } else if (data.type === "error") {
        queue.push({ type: "error", detail: data.detail ?? "Unknown error" })
        done = true
      }
    } catch {
      queue.push({ type: "error", detail: "Invalid server message" })
      done = true
    }
    if (resolveNext) {
      resolveNext()
      resolveNext = null
    }
  }

  ws.onerror = () => {
    queue.push({ type: "error", detail: "WebSocket connection error. Check that the AI backend is running and the URL is correct." })
    done = true
    if (resolveNext) {
      resolveNext()
      resolveNext = null
    }
  }

  ws.onclose = (ev) => {
    if (!done && queue.length === 0) {
      const reason = ev.reason || (ev.code === 1006 ? "Connection failed (is the backend running and proxy/ws enabled?)" : `Closed ${ev.code}`)
      queue.push({ type: "error", detail: reason })
    }
    done = true
    if (resolveNext) {
      resolveNext()
      resolveNext = null
    }
  }

  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => {
      ws.close()
      reject(new Error("WebSocket connection timed out. Try Stream without WebSocket or check the AI backend."))
    }, WS_OPEN_TIMEOUT_MS)
    ws.onopen = () => {
      clearTimeout(t)
      ws.send(JSON.stringify({ message }))
      resolve()
    }
    ws.onerror = () => {
      clearTimeout(t)
      reject(new Error("WebSocket failed to open. Use Stream without WebSocket or ensure the AI backend is running."))
    }
  })

  while (true) {
    if (queue.length > 0) {
      const ev = queue.shift()!
      yield ev
      if (ev.type === "done" || ev.type === "error") break
    } else if (done) {
      break
    } else {
      await new Promise<void>((r) => {
        resolveNext = r
      })
    }
  }
  ws.close()
}

/** POST /ai/chat/stream – stream step events then chunks. Yields StreamEvent. */
export async function* aiChatStream(message: string): AsyncGenerator<StreamEvent> {
  const res = await fetch(`${getBase()}/ai/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message ?? "AI stream failed")
  }
  const reader = res.body?.getReader()
  if (!reader) throw new Error("No response body")
  const dec = new TextDecoder()
  let buffer = ""
  let currentEvent = ""
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += dec.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim()
        } else if (line.startsWith("data: ") && currentEvent) {
          const raw = line.slice(6).trim()
          if (raw) {
            try {
              const data = JSON.parse(raw) as { message?: string; content?: string }
              if (currentEvent === "step" && data.message != null) {
                yield { type: "step", message: data.message }
              } else if (currentEvent === "chunk" && data.content != null) {
                yield { type: "chunk", content: data.content }
              }
            } catch {
              if (currentEvent === "chunk") yield { type: "chunk", content: raw }
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/** POST /ai/voice – upload audio file, get text reply. */
export async function aiVoice(audioFile: File): Promise<ChatResponse> {
  const form = new FormData()
  form.append("audio", audioFile)
  const res = await fetch(`${getBase()}/ai/voice`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message ?? "Voice request failed")
  }
  return res.json() as Promise<ChatResponse>
}

/** POST /ai/voice/tts – text to speech, returns mp3 blob. */
export async function aiTts(message: string): Promise<Blob> {
  const res = await fetch(`${getBase()}/ai/voice/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message ?? "TTS failed")
  }
  return res.blob()
}
