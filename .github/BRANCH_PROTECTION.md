# Branch protection & PR rules (GitHub)

Configure these in **GitHub → Repository → Settings → Branches → Branch protection rules** (or **Rules → Rulesets** on newer repos).

## 1. Require a pull request before merging

- **Branch name pattern:** `main` (or `master`)
- Enable: **Require a pull request before merging**
- **Required approvals: 2** (so two reviewers must approve)
- Optionally: **Dismiss stale pull request approvals when new commits are pushed**

## 2. Require status checks to pass

So merges are blocked until CI (lint, test, build) succeeds:

- Enable: **Require status checks to pass before merging**
- **Require branches to be up to date before merging** (recommended)
- In “Status checks that are required”, add:
  - **Lint, Test & Build** (this is the `validate` job name from `.github/workflows/ci.yml`)

If you use **Rulesets**:

- Create a ruleset for branch `main`
- Add rule: **Require status checks**
- Select the status check: **Lint, Test & Build**
- Add rule: **Require pull request reviews** → Required number: **2**

## 3. Optional

- **Require conversation resolution before merging** – all review comments must be resolved
- **Do not allow bypassing the above settings** – applies to admins too (optional)

After this, every PR will need 2 approvals and a passing CI (lint + test + build) before it can be merged.
