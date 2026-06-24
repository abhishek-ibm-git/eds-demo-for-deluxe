# Move About Us Package to Repo Root

## Objective

Move (or copy) the existing AEM content package zip from `migration-work/packages/` to the repository root so it's easy to find and download.

## Source → Destination

- **Source:** `migration-work/packages/eds-demo-for-deluxe-about-page.zip`
- **Destination:** `eds-demo-for-deluxe-about-page.zip` (repo root = `/workspace/current/`)

## Approach

- **Copy** rather than move, so the original stays in `migration-work/packages/` alongside its unzipped staging folder (`about-page/`) and the rest of the migration artifacts. This avoids breaking any path references and keeps the working set intact. (If you'd prefer a true move that removes the original, say so.)
- After copying, verify the zip at the repo root is byte-identical and still a valid package (well-formed XML inside, filter scoped to `/content/eds-demo-for-deluxe/about` only).

## Execution Steps (run in Execute mode)

1. `cp migration-work/packages/eds-demo-for-deluxe-about-page.zip ./eds-demo-for-deluxe-about-page.zip`
2. `ls -la eds-demo-for-deluxe-about-page.zip` to confirm it landed at the repo root.
3. Confirm the copy's contents match (3 entries: `.content.xml`, `filter.xml`, `properties.xml`).

## Checklist

- [x] Confirm source path of the existing package
- [x] Confirm destination (repo root) per user request
- [ ] Copy the zip to the repo root
- [ ] Verify the copied zip exists at repo root and is intact
- [ ] Report final location to user

## Note

> Copying/moving the file is a write action, so it **requires Execute mode**. Once you switch to Execute mode, I'll perform the copy and confirm the package is sitting at the repo root as `eds-demo-for-deluxe-about-page.zip`.
