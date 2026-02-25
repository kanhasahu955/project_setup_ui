# Releasing with Git tags and GitHub Releases

Use **Git tags** and **GitHub Releases** to version the app. The [Deploy workflow](.github/workflows/deploy.yml) runs on every **version tag** (`v*`): lint, test, build, then creates a **GitHub Release** with the built `dist/` files.

If you deploy the app on **Vercel**, production is updated when you **push to your main branch**. Tags/releases are for version history and artifacts, not for triggering Vercel. See [VERCEL.md](./VERCEL.md).

---

## Release steps

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

3. **Push to main** (so Vercel deploys the new version):

   ```bash
   git push origin main
   ```

4. **Create and push the tag** (this triggers the workflow and the GitHub Release):

   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   # or push branch and tags:  git push origin main --tags
   ```

5. **Check the release**  
   On GitHub: **Releases** → new release for `v1.1.0` with generated notes and the build artifact attached.

---

## Notes

- Tag names must match `v*` (e.g. `v1.0.0`, `v2.0.0-beta.1`).
- The app’s in-app version (`APP_VERSION`) matches the tag when built by the workflow.
- You can tag an existing commit: `git tag v1.1.0 <commit>` then `git push origin v1.1.0`.
