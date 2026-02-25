# Releasing on GitHub

Releases are created automatically when you push a **version tag** (`v*`, e.g. `v1.0.0`). The [Deploy workflow](.github/workflows/deploy.yml) runs: lint, test, build, then creates a GitHub Release with the built `dist/` files.

## Steps to release

1. **Bump version** (updates `package.json` only):

   ```bash
   pnpm run version:patch   # 1.0.0 → 1.0.1
   # or
   pnpm run version:minor   # 1.0.0 → 1.1.0
   # or
   pnpm run version:major   # 1.0.0 → 2.0.0
   ```

2. **Commit the bump:**

   ```bash
   git add package.json
   git commit -m "chore: release v1.1.0"
   ```

3. **Create and push the tag** (this triggers the workflow and the GitHub Release):

   ```bash
   git tag v1.1.0
   git push origin main --tags
   # or push only the tag:  git push origin v1.1.0
   ```

4. **Check the release**  
   On GitHub: **Releases** → new release for `v1.1.0` with generated notes and the build artifact attached.

## Notes

- Tag name must match `v*` (e.g. `v1.0.0`, `v2.0.0-beta.1`).
- The app’s in-app version (`APP_VERSION`) will match the tag when built by the workflow.
- If you deploy to Vercel from `main`, you can create the tag after merging so the release and Vercel deploy stay in sync.
