# Six&7 Shopify Portfolio Storefront

A custom Shopify Online Store 2.0 footwear portfolio built on Dawn. The project demonstrates responsive theme development, an accessible concept catalog and native commerce interactions while keeping the theme and concept products unpublished.

**Verified source commit:** `a111dc1b82adcbf931fe40895b408ac6ea686cc5`

**Store:** `sixseven-practice.myshopify.com`

**Target:** Six&7 Draft, theme `130298347569` — unpublished.

**Protected live theme:** Horizon, `130281734193`.

## Technology

| Layer | Implementation |
| --- | --- |
| Theme foundation | Shopify Dawn 16.0.0; Online Store 2.0 |
| Templates and rendering | Shopify Liquid, JSON templates, reusable snippets |
| Presentation | Custom responsive CSS, semantic HTML, SVG hero artwork |
| Interactions | Dawn's native JavaScript; native HTML disclosure controls for concepts |
| Merchant editing | Section schemas and global theme settings |
| Verification | Shopify CLI / Theme Check, authenticated Chromium with Playwright automation, Admin GraphQL reads, Git checks |
| Existing integration | Judge.me app blocks preserved |

## Implemented features

- Premium black, white and silver visual system with restrained red accents, a custom hero, category navigation and a featured-product section.
- Responsive header, mobile drawer, collection cards, galleries, About, Contact and footer layouts.
- Sixteen verified footwear concepts across Men, Women, Kids and Sports. Each card shows its approved title, Shopify-hosted image, description and USD price, with expandable details and clear non-purchasable messaging.
- Six homepage concept highlights; collection group counts: All 16, Men 7, Women 7, Kids 1, Sports 1. Kids/Sports are provisional demo groups, not verified suitability or performance claims.
- Editable Demo Preview Mode, section introductions/card limits, homepage SEO and a text-logo wordmark fallback.
- Product-specific disclosure names, keyboard focus states, reduced-motion support and a hero motion-pause control.
- Premium About routing through `/pages/about-us?view=about`, shared by header, footer and homepage CTA.
- SEO title/description fallbacks with corresponding social metadata, preserving existing nonempty merchant descriptions and product metadata.
- Draft-only portfolio information explaining missing policies without creating legal terms.
- The two existing Active products retain native search, filters, sorting, galleries, variants, cart and checkout entry.

## Custom Liquid architecture

| Files | Responsibility |
| --- | --- |
| `sections/six7-demo-catalog.liquid` | Editable concept section on the homepage and default collection template |
| `snippets/six7-demo-catalog.liquid` | Verified snapshot of the 16 approved concepts; manually refreshed when approved source data changes |
| `snippets/six7-demo-card.liquid` | Reusable image/price/description card with native expandable details |
| `snippets/six7-demo-product.liquid` | Exact-ID demo-product allowlist |
| `sections/main-product.liquid` and demo/payment-term snippets | Guard provisional selectors and purchase controls only for allowlisted concepts when demo mode is enabled |
| `sections/six7-hero.liquid`, `sections/six7-about.liquid` and custom CSS assets | Brand presentation and responsive refinement |
| `snippets/six7-navigation-url.liquid` | Consistent Draft-compatible premium About links |
| `snippets/six7-demo-information.liquid` | Theme-only portfolio and policy information |
| `layout/theme.liquid`, `snippets/meta-tags.liquid` | Demo-aware SEO and social metadata |
| `config/settings_schema.json` | Editable demo settings; existing setting IDs retained |

The concept catalog is a custom collection section, not a separate Shopify page, live product feed or currency-conversion service. Native product search/filter/sort operates separately on the published catalog.

## Open the demo

1. Open the [Draft catalog preview](https://sixseven-practice.myshopify.com/collections/all?preview_theme_id=130298347569#six7-concepts). Enter the storefront password directly in the browser if required; never put it in source files or chat.
2. Confirm the preview bar says **Six&7 Draft**.
3. Use **View concept** to expand a design. Use the group links to explore Men, Women, Kids and Sports.

In the [Theme Editor](https://sixseven-practice.myshopify.com/admin/themes/130298347569/editor), select **Collections → Default collection → Six7 concept preview** in the sidebar. Preview the All collection. If All is absent from the picker, disable the preview inspector and click Catalog inside the preview. Home page has a separate six-highlight section. Global controls are under **Theme settings → Six7 portfolio demo**.

Only two Active products appear in native product selectors/grids; that is expected. The concept cards do not publish the Draft products.

## Verified QA

The final verification run recorded **64 passed checks, zero unresolved failures and four known blockers**. Tested flows include navigation, predictive/submitted search, native filtering/sorting/reset, both Active galleries/lightboxes, available/unavailable variants, cart add/update/remove/re-add, checkout entry, concept disclosures, SEO/H1 hierarchy, form labels, reduced motion and motion pause. Layouts were checked at 390, 768 and 1440 CSS pixels without horizontal overflow on the tested routes.

Theme Check recorded **zero errors and nine existing warnings**. JSON and changed section schemas, supported custom CSS declarations and Git whitespace checks passed. The local commit validation independently checked 68 theme JSON files and the changed Liquid section schemas. These are targeted checks, not exhaustive accessibility or device certification.

The 16 concept records matched the approved Admin snapshot: all Draft, 12 variants each, zero inventory and DENY inventory policy. Product media, prices, variants and memberships were preserved. Temporary Active-product cart lines were removed after testing; no customer/payment information or order was submitted. Contact/newsletter submissions were deliberately not tested.

## Scope and limitations

- **Unpublished demonstration:** Six&7 Draft is not the live storefront. Live Horizon was preserved.
- **Native Draft product pages:** ordinary Axis 01 product URL returns 404. Signed Admin product-preview compatibility with the Draft theme is unconfirmed. Working concept disclosures are not native Draft product pages; the native demo guard is source-validated, not runtime-verified on those pages.
- **No concept purchasing:** all 16 products remain Draft with zero inventory. Unsupported Color/Size labels are preserved in Shopify and omitted from concept presentation; no inventory, variants or prices were fabricated.
- **Policies:** shipping, refund and terms routes are unconfigured. Privacy loads but requires owner review. Portfolio information is not a substitute for legal policies.
- **Payments and operations:** checkout entry was tested, but payment-provider configuration, transactions, shipping rates, tax and fulfillment were not verified as launch-ready. The project does not claim that payment settings are disabled or unconfigured.
- **Snapshot maintenance:** update the concept snippet only from newly verified, approved product data; displayed USD prices are not a live market/currency feed.

## Safe maintenance

Run `shopify theme check --path <theme-only-directory>` and `git diff --check` before changes. Keep reports and backups outside the validation directory to avoid scanning duplicate themes. Validate JSON templates and Liquid section schemas alongside Theme Check.

Before any future upload, download fresh Draft files, merge merchant changes, validate an isolated full theme and upload only an explicit file allowlist with `--nodelete`. Re-download and compare uploaded files. Local `config/settings_data.json`, `templates/product.json` and `templates/page.about.json` are older than protected remote copies; do not perform an unmerged full-theme push. Preserve Judge.me and existing About settings. Keep API credentials outside version control.

## Handover

See [portfolio-delivery](portfolio-delivery/README.md) for the case study, screenshot gallery/manifest, QA evidence, handover checklist, delivery summary and GitHub publication checks. Source verification reports remain under `reports/final-verification/` and `reports/final-sprint/`; they are local artifacts, not part of the committed theme.
