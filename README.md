# Live Bhoomi UI

Frontend for **Live Bhoomi** – React SPA for the real estate platform. Uses the Live Bhoomi backend API for auth, listings, KYC, and images.

---

## 🛠️ Tech stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library |
| [Vite](https://vite.dev/) | Build tool and dev server |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Ant Design](https://ant.design/) | UI components |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [React Router](https://reactrouter.com/) | Routing |
| [Redux Toolkit](https://redux-toolkit.js.org/) / [Zustand](https://zustand-demo.pmnd.rs/) | State |
| [Axios](https://axios-http.com/) | REST API client |
| [Apollo Client](https://www.apollographql.com/docs/react/) | GraphQL client |
| [Socket.IO Client](https://socket.io/docs/v4/client-api/) | Real-time socket connection |

---

## 🚀 Quick start

### Prerequisites

- **Node.js** >= 18
- **npm** or **pnpm**
- Backend API running (see [fastify_backend/README.md](../fastify_backend/README.md))

### Install and run

```bash
# From repo root
cd live_bhoomi_ui

# Install dependencies
npm install
# or: pnpm install

# Copy env for local dev (API at localhost:8000)
cp .env.dev .env
# Or edit .env and set VITE_API_BASE_URL=http://localhost:8000/api/v1

# Start dev server
npm run dev
# or: pnpm dev
```

- App: **http://localhost:5173**

---

## ⚙️ Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_STAGE` | Stage name (dev / qa / prod) | `dev` |
| `VITE_API_URL` | Base API URL (no path) | `http://localhost:8000` |
| `VITE_API_BASE_URL` | API base for requests (with `/api/v1`) | `http://localhost:8000/api/v1` |
| `VITE_APP_URL` | Public app URL (for SEO/canonical; optional) | `https://livebhoomi.com` |
| `VITE_SOCKET_URL` | Socket.IO server URL (optional; default: same as API origin) | `http://localhost:8000` |
| `VITE_APP_VERSION` | App version (optional) | From package.json |

**Local:** Use `.env.dev` or set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in `.env`.  
**Production:** Set `VITE_API_BASE_URL` (and optionally `VITE_APP_URL`) in your host (e.g. Vercel Environment Variables).

**GraphQL:** The client uses the same origin as the REST API with path `/graphql`. Override with `VITE_GRAPHQL_URL` if needed.

**Socket.IO:** The client connects to the same origin as the REST API (no path). Override with `VITE_SOCKET_URL` (e.g. `https://api.example.com`) if your socket server is different.

---

## 📡 GraphQL

The app uses **Apollo Client** to talk to the backend GraphQL API (same origin as REST, path `/graphql`). The client sends the auth token (from Redux `auth.token`) as `Authorization: Bearer <token>` on every request.

- **Config:** `src/config/apollo.config.ts` – `createApolloClient(getToken)`
- **Operations:** `src/graphql/operations.ts` – e.g. `ME`, `HEALTH`
- **Example hook:** `useMeQuery()` from `@/hooks/useMeQuery` (uses `useQuery(ME)`)

```tsx
import { useMeQuery } from '@/hooks/useMeQuery'

function Profile() {
  const { data, loading, error } = useMeQuery()
  if (loading) return <Spin />
  if (error) return <div>{error.message}</div>
  return <div>{data?.me?.name}</div>
}
```

Add more queries/mutations in `src/graphql/operations.ts` and use `useQuery` / `useMutation` from `@apollo/client` in your components.

---

## 🔌 Socket.IO (live updates & chat)

Reusable hooks for **live database updates** and **chat**. Backend must run a Socket.IO server and use the same event names (see `src/socket/events.ts`).

| Hook | Purpose |
|------|---------|
| `useSocket()` | `{ socket, connected }` from context |
| `useSocketEvent(socket, event, callback)` | Subscribe to an event (callback is ref-stable) |
| `useSocketEmit()` | Stable `emit(event, ...args)` to send events |
| `useSocketRoom(roomId)` | Join room on mount, leave on unmount |
| `useLiveUpdate(onUpdate, eventName?)` | Subscribe to live DB updates (default event: `live:update`) |
| `useChatRoom(roomId)` | Returns `{ sendMessage(content), sendTyping() }`; use with `useSocketEvent` for incoming messages/typing |

**Event names** (in `src/socket/events.ts`): `joinRoom`, `leaveRoom`, `live:update`, `message`, `typing`. Align with your backend.

### Live updates example

```tsx
import { useLiveUpdate } from '@/hooks/useLiveUpdate'
import { useMeQuery } from '@/hooks/useMeQuery'

function Listings() {
  const { data, refetch } = useMeQuery()

  useLiveUpdate((payload) => {
    if (payload.entity === "listing") refetch()
  })

  return <div>...</div>
}
```

### Chat example

```tsx
import { useSocket } from '@/context/SocketContext'
import { useChatRoom, useSocketEvent } from '@/hooks'
import { SOCKET_MESSAGE, SOCKET_TYPING } from '@/socket/events'

function Chat({ roomId }: { roomId: string }) {
  const { socket } = useSocket()
  const { sendMessage, sendTyping } = useChatRoom(roomId)
  const [messages, setMessages] = useState<ChatMessagePayload[]>([])

  useSocketEvent(socket, SOCKET_MESSAGE, (msg) => {
    setMessages((prev) => [...prev, msg])
  })
  useSocketEvent(socket, SOCKET_TYPING, (payload) => {
    // show typing indicator for payload.userId
  })

  return (
    <>
      {messages.map((m) => <div key={m.timestamp}>{m.content}</div>)}
      <input onKeyDown={(e) => e.key === "Enter" && sendMessage(e.currentTarget.value)} />
      <button onClick={() => sendTyping()}>Typing...</button>
    </>
  )
}
```

Set **VITE_SOCKET_URL** if your Socket.IO server is on a different origin.

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build (`--mode production`) |
| `npm run build:dev` | Build with dev env |
| `npm run build:qa` | Build with QA env |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Tests in watch mode |

---

## 🌐 Deployment (Vercel)

Deploy by connecting the repo to Vercel and setting the **Root Directory** to `live_bhoomi_ui` (monorepo).

See **[VERCEL.md](VERCEL.md)** for:

- Connecting GitHub and setting root directory
- Environment variables (`VITE_API_BASE_URL`, etc.)
- Build command and output directory

Production API example: `VITE_API_BASE_URL=https://live-bhoomi.onrender.com/api/v1`

---

## 📁 Project structure (overview)

```
live_bhoomi_ui/
├── public/
├── src/
│   ├── components/
│   ├── constants/
│   ├── pages/ (or routes)
│   ├── store/
│   ├── App.tsx
│   └── main.tsx
├── .env.dev / .env.qa / .env.production
├── vite.config.ts
├── package.json
├── README.md
├── VERCEL.md
└── RELEASE.md
```

---

## 📚 Related docs

| Doc | Description |
|-----|-------------|
| [../README.md](../README.md) | Monorepo overview and quick start |
| [../fastify_backend/README.md](../fastify_backend/README.md) | Backend API and env |
| [VERCEL.md](VERCEL.md) | Deploy frontend on Vercel |
| [RELEASE.md](RELEASE.md) | Versioning and releases |

---

**Live Bhoomi UI** – Frontend for the Live Bhoomi platform.
