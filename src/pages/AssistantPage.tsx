import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui'
import { PATHS, pathListingDetail } from '@/routes/paths'
import { toastStore } from '@/store/toast.store'
import {
  aiChat,
  aiChatStream,
  aiChatStreamOverWebSocket,
  aiTts,
  aiVoice,
  getAiDbStatus,
  type ListingReference,
  type DbStatus,
} from '@/services/ai.service'
import { MarkdownMessage } from '@/components/chat/MarkdownMessage'

const DEFAULT_STEPS = [
  'Fetching listings from database...',
  'Generating response...',
]

type MessageRole = 'user' | 'assistant'

interface Message {
  id: string
  role: MessageRole
  content: string
  isStreaming?: boolean
  references?: ListingReference[]
}

function formatPrice(price: number | null): string {
  if (price == null) return '—'
  return `₹${price.toLocaleString('en-IN')}`
}

function ReferenceCards({ refs }: { refs: ListingReference[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      {refs.map((r) => (
        <Link
          key={r.id}
          to={pathListingDetail(r.id)}
          className="block rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-emerald-400 hover:shadow transition-colors text-left"
        >
          <div className="font-medium text-slate-900 truncate">{r.title}</div>
          <div className="text-emerald-600 font-semibold text-sm mt-0.5">{formatPrice(r.price)}</div>
          <div className="text-slate-500 text-xs mt-1">
            {[r.locality, r.city, r.state].filter(Boolean).join(', ')}
          </div>
          <div className="text-slate-400 text-xs mt-1">
            {r.listingType} · {r.propertyType}
            {r.bedrooms != null && ` · ${r.bedrooms} BHK`}
            {r.area != null && ` · ${r.area} sqft`}
          </div>
        </Link>
      ))}
    </div>
  )
}

function ReferenceTable({ refs }: { refs: ListingReference[] }) {
  return (
    <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-left">
            <th className="px-3 py-2 font-medium">Title</th>
            <th className="px-3 py-2 font-medium">Price</th>
            <th className="px-3 py-2 font-medium">Location</th>
            <th className="px-3 py-2 font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          {refs.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-3 py-2">
                <Link
                  to={pathListingDetail(r.id)}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  {r.title}
                </Link>
              </td>
              <td className="px-3 py-2 text-slate-700">{formatPrice(r.price)}</td>
              <td className="px-3 py-2 text-slate-600">
                {[r.locality, r.city].filter(Boolean).join(', ')}
              </td>
              <td className="px-3 py-2 text-slate-600">
                {r.listingType} · {r.propertyType}
                {r.bedrooms != null && ` · ${r.bedrooms} BHK`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamMode, setStreamMode] = useState(false)
  const [useWebSocket, setUseWebSocket] = useState(true)
  const [referencesView, setReferencesView] = useState<'cards' | 'table'>('cards')
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null)
  const [dbStatusLoading, setDbStatusLoading] = useState(true)
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [completedStepCount, setCompletedStepCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchDbStatus = useCallback(() => {
    setDbStatusLoading(true)
    getAiDbStatus()
      .then(setDbStatus)
      .catch(() =>
        setDbStatus({ connected: false, database: '', collections: [], error: 'Request failed' }),
      )
      .finally(() => setDbStatusLoading(false))
  }, [])

  useEffect(() => {
    fetchDbStatus()
  }, [fetchDbStatus])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const addMessage = useCallback(
    (role: MessageRole, content: string, opts?: { isStreaming?: boolean; references?: ListingReference[] }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role,
          content,
          isStreaming: opts?.isStreaming,
          references: opts?.references,
        },
      ])
      scrollToBottom()
    },
    [scrollToBottom],
  )

  const updateLastAssistant = useCallback(
    (content: string, isStreaming?: boolean, references?: ListingReference[]) => {
      setMessages((prev) => {
        const next = [...prev]
        const last = [...next].reverse().find((m) => m.role === 'assistant')
        if (last) {
          last.content = content
          if (isStreaming !== undefined) last.isStreaming = isStreaming
          if (references !== undefined) last.references = references
        }
        return next
      })
      scrollToBottom()
    },
    [scrollToBottom],
  )

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    addMessage('user', text)
    setLoading(true)
    setProcessingSteps(DEFAULT_STEPS)
    setCompletedStepCount(0)

    try {
      if (streamMode) {
        addMessage('assistant', '', { isStreaming: true })
        const stream = useWebSocket ? aiChatStreamOverWebSocket(text) : aiChatStream(text)
        let full = ''
        let refs: ListingReference[] | undefined
        for await (const event of stream) {
          if (event.type === 'step') {
            setCompletedStepCount((n) => n + 1)
          } else if (event.type === 'chunk') {
            full += event.content
            updateLastAssistant(full, true)
          } else if (event.type === 'done') {
            refs = event.references
          } else if (event.type === 'error') {
            toastStore.getState().showError(event.detail)
            updateLastAssistant(`Error: ${event.detail}`, false)
            return
          }
        }
        updateLastAssistant(full, false, refs)
      } else {
        const { reply, references, steps } = await aiChat(text)
        setProcessingSteps(steps ?? DEFAULT_STEPS)
        setCompletedStepCount(steps?.length ?? DEFAULT_STEPS.length)
        addMessage('assistant', reply, { references: references ?? [] })
      }
    } catch (e) {
      const message =
        e instanceof Error && e.name === 'AbortError'
          ? 'Request took too long. Try Stream mode for faster first response.'
          : e instanceof Error
            ? e.message
            : 'Something went wrong'
      toastStore.getState().showError(message)
      addMessage('assistant', `Error: ${message}`)
    } finally {
      setLoading(false)
      setProcessingSteps([])
      setCompletedStepCount(0)
    }
  }, [input, loading, streamMode, useWebSocket, addMessage, updateLastAssistant])

  const handleVoiceUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || loading) return
      e.target.value = ''
      addMessage('user', '[Voice message]')
      setLoading(true)
      setProcessingSteps(DEFAULT_STEPS)
      setCompletedStepCount(0)
      try {
        const { reply, references, steps } = await aiVoice(file)
        setCompletedStepCount(steps?.length ?? DEFAULT_STEPS.length)
        addMessage('assistant', reply, { references: references ?? [] })
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Voice request failed'
        toastStore.getState().showError(message)
        addMessage('assistant', `Error: ${message}`)
      } finally {
        setLoading(false)
        setProcessingSteps([])
        setCompletedStepCount(0)
      }
    },
    [loading, addMessage],
  )

  const handleSpeak = useCallback(async () => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant' && m.content)
    if (!lastAssistant?.content || loading) return
    setLoading(true)
    try {
      const blob = await aiTts(lastAssistant.content)
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      await audio.play()
      audio.onended = () => URL.revokeObjectURL(url)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'TTS failed'
      toastStore.getState().showError(message)
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  return (
    <>
      <SEO
        title="AI Assistant"
        description="Get property suggestions from the Live Bhoomi AI assistant."
        canonical={PATHS.ASSISTANT}
        noIndex
      />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold mb-2 text-slate-900">AI Assistant</h1>
          <p className="text-slate-600 text-sm mb-4">
            Ask for property suggestions by text or voice. The assistant reads from the Live Bhoomi
            database. References appear as cards or table below each reply.
          </p>

          {/* Database status: online, database name, tables, sample data */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">Database status</h2>
              <button
                type="button"
                onClick={fetchDbStatus}
                disabled={dbStatusLoading}
                className="text-xs text-emerald-600 hover:underline disabled:opacity-50"
              >
                {dbStatusLoading ? 'Checking…' : 'Refresh'}
              </button>
            </div>
            {dbStatusLoading ? (
              <p className="text-slate-500 text-sm">Checking connection…</p>
            ) : dbStatus ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      dbStatus.connected ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    aria-hidden
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {dbStatus.connected ? 'Online' : 'Offline'}
                  </span>
                  {dbStatus.database && (
                    <span className="text-slate-500 text-sm">· {dbStatus.database}</span>
                  )}
                </div>
                {dbStatus.error && (
                  <p className="text-red-600 text-xs">{dbStatus.error}</p>
                )}
                {dbStatus.collections.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Collections (tables)
                    </p>
                    <ul className="text-sm text-slate-700 space-y-0.5">
                      {dbStatus.collections.map((c) => (
                        <li key={c.name} className="flex justify-between gap-2">
                          <span className="font-mono">{c.name}</span>
                          <span className="text-slate-500">{c.count} docs</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {dbStatus.listingSample && dbStatus.listingSample.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Listing sample (latest 5)
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-left">
                            <th className="px-2 py-1.5 font-medium">Title</th>
                            <th className="px-2 py-1.5 font-medium">Price</th>
                            <th className="px-2 py-1.5 font-medium">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dbStatus.listingSample.map((r) => (
                            <tr key={r.id} className="border-b border-slate-100 last:border-0">
                              <td className="px-2 py-1.5">
                                <Link
                                  to={pathListingDetail(r.id)}
                                  className="text-emerald-600 hover:underline truncate block max-w-[180px]"
                                >
                                  {r.title || '—'}
                                </Link>
                              </td>
                              <td className="px-2 py-1.5 text-slate-700">
                                {formatPrice(r.price)}
                              </td>
                              <td className="px-2 py-1.5 text-slate-600 truncate max-w-[120px]">
                                {[r.locality, r.city].filter(Boolean).join(', ') || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Could not load status.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
            <div className="flex-1 min-h-[320px] max-h-[55vh] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-slate-500 text-sm">Send a message or use voice to get started.</p>
              )}
              {loading && processingSteps.length > 0 && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 bg-slate-100 border border-slate-200 w-full max-w-[90%]">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Processing
                    </p>
                    <ul className="space-y-1.5">
                      {processingSteps.map((step, i) => (
                        <li key={step} className="flex items-center gap-2 text-sm text-slate-700">
                          {i < completedStepCount ? (
                            <span className="text-emerald-500 shrink-0" aria-hidden>✓</span>
                          ) : (
                            <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin shrink-0" aria-hidden />
                          )}
                          <span className={i < completedStepCount ? 'text-slate-500' : ''}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] ${m.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      } ${m.isStreaming ? 'animate-pulse' : ''}`}
                    >
                      {m.role === 'assistant' ? (
                        <MarkdownMessage content={m.content || (m.isStreaming ? '…' : '')} />
                      ) : (
                        m.content
                      )}
                    </div>
                    {m.role === 'assistant' && m.references && m.references.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            References ({m.references.length})
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setReferencesView('cards')}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                referencesView === 'cards'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Cards
                            </button>
                            <button
                              type="button"
                              onClick={() => setReferencesView('table')}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                referencesView === 'table'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              Table
                            </button>
                          </div>
                        </div>
                        {referencesView === 'cards' ? (
                          <ReferenceCards refs={m.references} />
                        ) : (
                          <ReferenceTable refs={m.references} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200 flex flex-wrap items-center gap-2 bg-slate-50/80">
              <label className="flex items-center gap-1.5 text-slate-600 text-xs cursor-pointer" title="Stream shows reply as it’s generated (feels faster)">
                <input
                  type="checkbox"
                  checked={streamMode}
                  onChange={(e) => setStreamMode(e.target.checked)}
                  className="rounded border-slate-400"
                />
                Stream (faster first response)
              </label>
              {streamMode && (
                <label className="flex items-center gap-1.5 text-slate-600 text-xs cursor-pointer" title="Use WebSocket for streaming (persistent connection)">
                  <input
                    type="checkbox"
                    checked={useWebSocket}
                    onChange={(e) => setUseWebSocket(e.target.checked)}
                    className="rounded border-slate-400"
                  />
                  WebSocket
                </label>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask for properties…"
                className="flex-1 min-w-[120px] h-9 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={loading}
              />
              <Button
                type="primary"
                htmlType="button"
                onClick={handleSend}
                loading={loading}
                disabled={loading || !input.trim()}
                className="h-9"
              >
                Send
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  className="hidden"
                  disabled={loading}
                />
                <span className="inline-flex items-center h-9 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm hover:bg-slate-50">
                  🎤 Voice
                </span>
              </label>
              <Button
                type="default"
                htmlType="button"
                onClick={handleSpeak}
                disabled={
                  loading ||
                  ![...messages].reverse().find((m) => m.role === 'assistant' && m.content)
                }
                className="h-9"
                title="Speak last reply"
              >
                🔊 Speak
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
