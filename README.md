# Mahallu screen specifications

Internal page-by-page documentation for the Mahallu development team. The site combines user explanations with current screen behavior in English and Malayalam.

Start at `mahallu-app-overview.mdx`. The five navigation tabs cover the overview, Mahallu Admin, Control Panel, Mahallu Member, and Marketing. `reference/coverage.mdx` maps all 90 application page routes and lists observed implementation gaps.

## Source review

The application source is `/Volumes/New Volume/mahall-app`. The initial review uses the working tree on 13 October 2026. Source paths, route-to-document mappings, and hashes are stored in `reference/route-inventory.json`.

These specifications describe current behavior, including controls that do not persist data. They are not evidence of successful authenticated application journeys. Read `AGENTS.md` before editing.

## Check and preview

Use Node.js to run the dependency-free content checks:

```bash
node scripts/check-docs.mjs
```

To compare route coverage and source hashes against an application checkout:

```bash
node scripts/check-docs.mjs --source '/Volumes/New Volume/mahall-app'
```

With the Mintlify CLI available:

```bash
mint validate --telemetry=false
mint broken-links
mint dev --port 3005
```

The preview opens at `http://localhost:3005`. Check long tables on desktop/mobile and switch both language tabs. The CLI can also be invoked through `npx mint` without a global installation.

## Maintaining a specification

1. Read the route, rendered components, forms/dialogs, data calls, and applicable API behavior.
2. Update the seven screen sections in both languages. Keep exact UI labels and identifiers.
3. Map added routes and documentation pages in the inventory and `docs.json`.
4. Update source hashes only after reviewing the changed behavior.
5. Run checks and preview the changed pages.

The site is prepared locally. Production publishing and restricting access to the development team are separate hosting tasks.
