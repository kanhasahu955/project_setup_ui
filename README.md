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
| [Axios](https://axios-http.com/) | API client |

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
| `VITE_APP_VERSION` | App version (optional) | From package.json |

**Local:** Use `.env.dev` or set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in `.env`.  
**Production:** Set `VITE_API_BASE_URL` (and optionally `VITE_APP_URL`) in your host (e.g. Vercel Environment Variables).

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
