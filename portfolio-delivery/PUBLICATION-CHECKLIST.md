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

## Completed Git privacy and private publication

- [x] Rewrite only the initial 12 commits reachable from `main` to use the owner-provided GitHub noreply email for both author and committer. Preserve source trees, messages, names, timestamps and parent relationships. Independent integrity and backup recovery checks passed.
- [x] Configure repository-local Git name/email for future commits; leave global and system identity settings unchanged.
- [x] Verify the sanitized theme source commit `74ea65f15a228da180094b06d77e91b09d3c3245` against the private rewrite mapping and original source tree. The screenshot manifest preserves the original capture commit explicitly as historical provenance.
- [x] Verify ownership and **PRIVATE** visibility of [six7-shopify-store](https://github.com/sahilbhardwaj037037-sys/six7-shopify-store), then push only `refs/heads/main:refs/heads/main` without force, tags or mirror operations.
- [x] Independently verify the initial private publication at `513fed8507de5a8a9d566294d2f3c0b66777ed35`: all 12 commits sanitized, intended files and 26 screenshots present, no excluded files or additional remote branches/tags. This is the initial publication milestone; subsequent documentation changes use ordinary commits.
- [x] Preserve all 15 local checkpoint refs. Keep checkpoint refs, reflogs, original metadata, backups and recovery bundles private; none are part of the published branch.

## Before an owner-approved public release

- [ ] Obtain explicit approval to change repository visibility from **PRIVATE** to Public. Private publication does not authorize that change.
- [ ] Continue using ordinary noreply-authored commits and explicit `main`-only pushes. Keep local `refs/agents/*` and `refs/codex/*` private; do not mirror-push all refs.

The repository is published privately and ready for owner review. The Shopify theme remains unpublished. A future public GitHub release would not make the Draft storefront publicly accessible or imply real-commerce launch readiness. Original QA facts and screenshot capture timestamps remain unchanged.
