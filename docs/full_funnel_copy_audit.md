# Full Funnel Copy Audit

## Scope

This audit covers the full customer-facing funnel for `naturemelody.ru`:

- `index.html`
- `about.html`
- `series.html`
- `catalog.html`
- `policy.html`
- `offer.html`
- `care-dry-skin.html`
- `care-oily-skin.html`
- `care-aftershave.html`
- `care-tonics-hydrolats.html`
- `care-cleansing.html`
- `care-recovery-balms.html`
- `product-*.html` static product pages
- shared renderers and data sources that shape page copy

Excluded from narrative work:

- `product.html` as a noindex routing shell
- `yandex_3bd91faae93c2a10.html` as a verification file

## Public Page Inventory

### Core funnel pages

- `index.html`
  Role: first entry, recognition, trust, next-step orientation.
- `series.html`
  Role: selection by skin state before product comparison.
- `catalog.html`
  Role: comparison layer when the task is already mostly clear.
- `about.html`
  Role: trust and author credibility without switching to brand-deck language.

### SEO landing pages

- `care-dry-skin.html`
- `care-oily-skin.html`
- `care-aftershave.html`
- `care-tonics-hydrolats.html`
- `care-cleansing.html`
- `care-recovery-balms.html`

Role: organic entry pages for skin-state and care-intent queries, each bridging from problem recognition to a filtered set of products.

### Product pages

Static product pages are generated from shared data and include:

- creams for comfort and recovery
- seboregulating care
- aftershave products
- tonics and hydrolates
- cleansing products
- local recovery products

Current generated count during this pass: `29`.

### Legal pages

- `policy.html`
- `offer.html`

Role: support trust and ordering clarity. They do not drive acquisition, but they affect confidence near purchase.

## Major Reusable Text Sources

- `data.js`
  Holds brand copy, benefits, timeline, series copy, shared product copy, tonic/hydrolat factories, and most product-level narrative.
- `main.js`
  Holds shared CTA labels, empty states, catalog framing, legal intro, product-page section headings, card microcopy, and footer/header wording.
- `analysis/seo/build-seo.mjs`
  Generates all `care-*` and `product-*` pages, including hero copy, section headings, CTA labels, FAQ headings, and product/collection templates.

## Funnel Audit By Page

### Homepage

Current role before rewrite:

- introduce the brand
- show the route into series, catalog, and trust

Main problems before rewrite:

- the page often explained the selection system rather than the visitor’s situation
- several blocks described how to move through the site instead of why the next step matters
- trust content was strong in tone but not always tied back to customer value

Customer question that was under-answered:

- “Is this for my current skin situation, and where should I start?”

Rewrite requirement:

- lead with recognizable skin states
- keep trust calm and adult
- turn “how the site works” into “how this gets easier for you”

### Series Page

Current role before rewrite:

- narrow choice by direction before product comparison

Main problems before rewrite:

- internal selection logic was foregrounded
- the page spoke like a curator of structure, not a calm guide for a person with a skin concern

Customer question that was under-answered:

- “Which direction sounds like my case?”

Rewrite requirement:

- open with customer state
- make each direction sound like help, not taxonomy

### Catalog Page

Current role before rewrite:

- compare the product assortment

Main problems before rewrite:

- the hero described catalog architecture
- CTA logic talked about process more than benefit
- filtered catalog states still felt like system output

Customer question that was under-answered:

- “If I already know my need, can I compare calmly from here?”

Rewrite requirement:

- present catalog as a calm comparison layer
- keep “go to series first” only as a helpful fallback, not as internal instruction

### About Page

Current role before rewrite:

- explain brand history and approach

Main problems before rewrite:

- too much brand-explaining language
- the value of the story for the customer was implied, not clearly stated

Customer question that was under-answered:

- “Why should I trust this person with my skin and money?”

Rewrite requirement:

- keep the story
- translate history into relevance for the client

### Care Landing Pages

Current role before rewrite:

- organic entry pages for specific care intents

Main problems before rewrite:

- some headings still framed the series as a structure
- “how the selection works” language leaked into the page body
- FAQ framing still referenced page mechanics in places

Customer question that was under-answered:

- “When is this direction actually mine, and what should I open first?”

Rewrite requirement:

- keep SEO utility
- strengthen recognition, benefit, and first-step guidance

### Product Pages

Current role before rewrite:

- convert from interest to a confident item-level decision

Main problems before rewrite:

- section labels still contained system language like “series logic”
- many data-driven product texts included source-provenance notes such as “on the original site” or “on Tilda”
- some microcopy sounded like internal catalog maintenance rather than customer guidance

Customer question that was under-answered:

- “What does this actually do for me, and what else should I know before ordering?”

Rewrite requirement:

- keep product specificity
- remove provenance artifacts
- rename sections to customer-facing meanings

### Legal Pages

Current role before rewrite:

- remove friction before purchase

Main problems before rewrite:

- intro copy sounded like an internal pre-launch note

Customer question that was under-answered:

- “What should I check before ordering?”

Rewrite requirement:

- keep legal clarity
- replace internal framing with calm practical guidance

## Repeating Narrative Problems Found Before Rewrite

- system-first phrasing: “catalog structure”, “selection logic”, “route”, “first do X then Y”
- brand-deck phrasing that described the brand before recognizing the client
- template copy that treated product cards as objects in an information system
- source-trace copy leaking into public pages from `data.js`

## Audit Outcome

The site did not have a tone problem as much as a point-of-view problem.

The strongest path after the rewrite had to become:

1. recognize the skin state
2. reduce confusion
3. show which direction is relevant
4. explain the benefit in plain language
5. offer one calm next step
