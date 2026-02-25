# Publish on Vercel with Git

Deploy the app by connecting your GitHub repo to Vercel. Production deploys from your main branch; every push and PR gets a preview URL. Use **Git tags** and **GitHub Releases** for versioning (see [RELEASE.md](./RELEASE.md)).

---

## 1. One-time setup

### Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** your Git repository (e.g. `your-username/live_bhoomi`).
4. Configure the project:
   - **Root Directory:** If the repo is only this app, leave as `.`. If the repo is a monorepo, set to `live_bhoomi_ui`.
   - **Framework Preset:** Vite (auto-detected from `vercel.json`).
   - **Build Command:** `pnpm run build` (or `pnpm run build:skip-check` if you skip the TypeScript check).
   - **Output Directory:** `dist`.
   - **Install Command:** `pnpm install`.

### Environment variables

In the project: **Settings** → **Environment Variables**, add:

| Name                 | Value                          | Environments   |
|----------------------|--------------------------------|----------------|
| `VITE_API_BASE_URL`  | `https://your-backend.com/api/v1` | Production (and Preview if you want) |

Use your real API URL. Leave blank for Preview to use the default from code.

Click **Deploy** to run the first build.

---

## 2. How deploys work

| Trigger              | What happens |
|----------------------|--------------|
| Push to **production branch** (e.g. `main`) | Vercel builds and updates **Production** (your live URL). |
| Push to other branch | Vercel builds and gives a **Preview** URL. |
| Open a **Pull Request** | Vercel builds and attaches a **Preview** URL to the PR. |

You do **not** need to create a Git tag for Vercel to deploy. Tags are for **GitHub Releases** (version history and artifacts). Typical flow:

1. Merge to `main` → Vercel deploys production.
2. Create a tag (e.g. `v1.1.0`) and push → [Deploy workflow](.github/workflows/deploy.yml) creates a **GitHub Release** with the built files.

---

## 3. Using tags and GitHub Releases

- **Tag:** e.g. `v1.1.0`. Push with: `git push origin v1.1.0` (or `git push origin main --tags`).
- **GitHub Release:** Created automatically by the workflow when you push a tag. See [RELEASE.md](./RELEASE.md) for the full flow (bump version → commit → tag → push).

Your live app on Vercel is driven by the **branch** (usually `main`). Tags/releases are for versioning and release notes, not for triggering Vercel.

---

## 4. Optional: build without type check

If you use the “skip type check” build locally, set in Vercel:

- **Build Command:** `pnpm run build:skip-check`

Otherwise keep **Build Command** as `pnpm run build`.
