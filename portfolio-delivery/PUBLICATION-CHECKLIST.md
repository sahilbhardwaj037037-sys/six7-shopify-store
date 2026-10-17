# GitHub Publication Checklist

Documentation/security review date: **17 October 2026**. Storefront verification and screenshots remain dated **13 October 2026**; this review does not claim a fresh Shopify audit.

## Prepared locally

- Root README, case study, handover documentation and screenshot manifest reviewed.
- All 26 selected PNGs have a distinct page/device/scope purpose; verified checksums and no text/EXIF metadata. Captures show storefront content, not Admin, credentials, account details, checkout/customer forms or browser authentication.
- Working-tree files and reachable historical file blobs scanned for provider tokens, private keys, literal credential assignments, known private API credential values, signed preview links, temporary share-preview hosts, personal local paths and email addresses.
- No credential or temporary-preview-link matches found in proposed public files or `main` file history. Pattern and known-value scans reduce risk; they are not a guarantee against every possible secret format.
- Backups, raw API/audit reports, private environment files, browser/network captures and generated delivery validation excluded through ignore rules and an explicit staging allowlist.
- Stable `preview_theme_id` links identify the unpublished theme; they are not temporary signed product-preview keys and do not grant storefront authentication.
- Screenshot coverage, PNG integrity, file sizes, JSON manifest, relative document links and staged whitespace checked before commit.

## Before an owner-approved public release

- [ ] Review author/committer identity in existing Git metadata. Historical commits contain an automatically generated local-machine email identity; file-content secret scans do not remove Git metadata. No identity or history was rewritten.
- [ ] Publish only the intended project branch. Local `refs/agents/*` and `refs/codex/*` checkpoint refs contain excluded local artifacts, including personal filesystem paths. Keep those refs private; do not mirror-push all refs.
- [ ] Approve repository creation, visibility and a specific push separately. Neither a remote repository nor a push is created by this documentation task.

The source and documentation are prepared for GitHub review. Public release does not make the unpublished theme publicly accessible and does not imply real-commerce launch readiness.
