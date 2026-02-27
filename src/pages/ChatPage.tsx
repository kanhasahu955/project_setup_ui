import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { SEO } from '@/components/SEO'
import { ChatPanel } from '@/components/chat'
import { PATHS } from '@/routes/paths'

/** Default room when no query param: general support chat. */
const DEFAULT_CHAT_ROOM = 'general'

export function ChatPage() {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('room') ?? DEFAULT_CHAT_ROOM
  const user = useAppSelector((s) => s.auth.user)

  return (
    <>
      <SEO
        title="Chat"
        description="Live chat on Live Bhoomi."
        canonical={PATHS.CHAT}
        noIndex
      />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold mb-4">Chat</h1>
          <p className="text-slate-400 text-sm mb-4">
            Room: <span className="text-slate-300 font-mono">{roomId}</span>. Share this page with the same room to chat together.
          </p>
          <ChatPanel
            roomId={roomId}
            title={roomId === DEFAULT_CHAT_ROOM ? 'General chat' : `Room: ${roomId}`}
            currentUserId={user?.id}
            currentUserName={user?.name}
          />
        </div>
      </div>
    </>
  )
}
