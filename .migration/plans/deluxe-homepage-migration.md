The plan is approved and ready. Let me exit plan mode so I can run the re-import.Plan's approved. Let me start by verifying the missing file and the intact import infrastructure.# Restore Missing Homepage Content Plan

**Source:** https://www.deluxe.com/
**Scope:** Single homepage (`content/index.plain.html`)
**Project type:** xwalk (AEM Universal Editor / crosswalk)
**Mode:** Recovery — re-import to regenerate missing content
**Status:** ✅ Approach approved (re-import fallback) — **plan mode is still active; switch to Execute mode to run the import.** Plan mode blocks the bundle/import commands and the file write.

---

## Diagnosis

The page renders empty because **`content/index.plain.html` no longer exists** in the workspace.

- `/workspace/current/content/` has **no files** — the imported homepage document is gone.
- The only `index.plain.html` on disk is an **archived SEI-demo version** at `migration-work/_archive-20260618-051758/content/index.plain.html` (old, unrelated SEI content). It will **not** be used.
- **Import infrastructure is intact** and will be reused as-is:
  - `tools/importer/import-homepage.js` (+ `import-homepage.bundle.js`)
  - Parsers: `cards-product`, `tabs-solutions`, `cards-stats`, `cards-services`, `cards-news`
  - Transformers: `deluxe-cleanup`, `deluxe-sections`
- Global fragments untouched: `nav.plain.html`, `footer.plain.html` (refactored Deluxe footer). Block CSS/JS and `styles.css` are all in place.

---

## Chosen Recovery Method: Re-import

Re-run the existing bundled import against https://www.deluxe.com/ with `--disable-http2` to regenerate `content/index.plain.html`. This recreates all blocks and sections. Any refinement that lived only in the deleted file (not in the import script) will be flagged and re-applied. Because styling, nav, and footer are intact, the page will render like the last working version once the content document is back.

> **To proceed:** exit plan mode / switch to Execute mode. The steps below will then run.

---

## Checklist

- [ ] **Step 1 — Confirm loss:** Verify `content/index.plain.html` is missing and the SEI archive is not a valid source.
- [ ] **Step 2 — Verify infrastructure:** Confirm the 5 parsers + 2 transformers + `import-homepage.js`/bundle are present and pass `node --check`.
- [ ] **Step 3 — Rebundle if needed:** Ensure `import-homepage.bundle.js` is current with the parsers/transformers; rebuild the bundle if stale.
- [ ] **Step 4 — Re-run import:** Execute the bundled homepage import against https://www.deluxe.com/ with `--disable-http2`, regenerating `content/index.plain.html`.
- [ ] **Step 5 — Structural check:** Confirm the imported doc has all 7 sections, the 5 block variants, and both section-metadata bands (stats-blue, cta-red).
- [ ] **Step 6 — Preview verification:** Load the homepage in preview; confirm content renders, nav + refactored footer show, CTA chevrons and stats band styled, no cookie/chat/tracking leakage.
- [ ] **Step 7 — Gap check:** Compare against the last-seen version; if any section is missing a prior hand-tweak, report it and re-apply.

---

## Expected Artifacts

- [ ] `content/index.plain.html` (regenerated Deluxe homepage) — **the missing file being recovered**
- [ ] `tools/importer/reports/import-homepage.report.xlsx` (refreshed import report)

---

## Open Questions / Decisions

- [ ] **Recovery method:** Re-import (confirmed). The on-disk SEI archive will **not** be used.
- [ ] **Out of scope:** Nav and footer files are intact; no changes planned there unless requested.
