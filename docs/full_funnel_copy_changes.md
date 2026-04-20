# Full Funnel Copy Changes

## Summary

This pass implemented a full customer-centered rewrite across the site’s main funnel, reusable data sources, and generated SEO pages.

The biggest structural shift:

- away from explaining the site and catalog
- toward helping a visitor recognize their situation, understand relevance, and choose a calm next step

## Files Changed

### `index.html`

- rewrote hero, floating note, trust framing, selection framing, benefits framing, and featured-products intro
- updated meta descriptions for a more customer-centered entry angle

### `about.html`

- rewrote hero and trust framing from customer value
- changed CTA order toward selection and catalog
- repositioned history and values as client-relevant trust, not brand-deck narrative
- updated metadata and schema descriptions

### `catalog.html`

- rewrote hero copy and CTA logic
- reframed the page as a calm comparison layer
- updated metadata and collection description

### `main.js`

- updated shared header CTA and empty-cart guidance
- rewrote repeated card microcopy and product page section labels
- rewrote catalog dynamic headline/copy
- updated related-product language and legal intro copy

### `data.js`

- rewrote brand footer and shared brand copy
- rewrote production cards, benefits, and timeline
- updated series short copy for homepage and previews
- cleaned product data of source-provenance artifacts
- rewrote tonic and hydrolat factory copy to improve all derived pages

### `analysis/seo/build-seo.mjs`

- rewrote care-landing intros and first-step guidance
- updated FAQ framing where it still sounded system-led
- updated product and collection templates to use customer-centered headings and CTA labels

### Generated files

Regenerated from `analysis/seo/build-seo.mjs`:

- `care-aftershave.html`
- `care-cleansing.html`
- `care-dry-skin.html`
- `care-oily-skin.html`
- `care-recovery-balms.html`
- `care-tonics-hydrolats.html`
- all `product-*.html` files

## QA Notes

Local QA performed after the rewrite:

- preview server on `http://127.0.0.1:4174`
- browser pass on `index`, `about`, `series`, `catalog`, `care-dry-skin`, `product-flora-direct`
- viewport checks at `390x844` and `1440x1200`
- page-level overflow result on checked pages: `0`
- Playwright console result on checked pages: `0` errors, `0` warnings

## Residual Risks

- Some product copy is intentionally concise because the project still uses a relatively compact card/detail layout.
- Longer customer-centered copy can still need visual review if future product descriptions expand further.
- Product pages remain data-driven; future edits should be done in `data.js` first, not directly in generated files.

## Recommended Next Iteration

1. Observe Yandex and Search Console query data after the new copy is crawled.
2. Tighten product-level copy again using real search and conversion signals.
3. Add a second trust layer if customer questions cluster around ingredients, shipping, or custom formulas.
