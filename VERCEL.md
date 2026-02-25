# Deploy on Vercel

## One-time setup

1. **Import project**  
   In [Vercel](https://vercel.com), import your Git repo. Use the **live_bhoomi_ui** directory as the root if the repo is a monorepo.

2. **Build settings** (usually auto-detected from `vercel.json`)
   - **Framework Preset:** Vite  
   - **Build Command:** `pnpm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `pnpm install`

3. **Environment variables**  
   In Project → Settings → Environment Variables, add:

   | Name                | Value                          | Environments   |
   |---------------------|--------------------------------|----------------|
   | `VITE_API_BASE_URL` | `https://your-api.com/api/v1`  | Production    |

   Use your real backend URL. For Preview (PR) builds you can set a different value or leave blank to use the default from code.

## Deploy

- **Production:** Push to the production branch (e.g. `main`) or create a release tag.  
- **Preview:** Every push/PR gets a preview URL.

## Monorepo

If the repo root is above `live_bhoomi_ui`:

- Set **Root Directory** to `live_bhoomi_ui` in Vercel project settings.
