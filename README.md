# Mahallu Documentation

English user guides for Mahallu administrators, accountants, platform operators, members, and prospective customers. The site explains everyday tasks, forms, choices, access requirements, troubleshooting, and current feature limitations.

Start at `mahallu-app-overview.mdx`. The five navigation areas cover Overview, Mahallu Admin, Control Panel, Mahallu Member, and Marketing. `reference/coverage.mdx` is the user-facing guide directory. Existing documentation slugs are retained.

## Source review and coverage

Inspect `/Volumes/New Volume/mahall-app` without modifying it. `reference/route-inventory.json` tracks 90 application page routes, their user-guide sections and anchors, and the source snapshot and hashes reviewed on 13 October 2026. The English user-guide conversion is dated separately on 15 October 2026.

A documentation rewrite does not establish a new complete source review or a successful authenticated application journey. Keep the recorded snapshot accurate; update hashes only after reviewing changed behavior. The guides describe preview-only and unavailable features without promising that a success message confirms a saved change.

## Check and preview

Run the dependency-free content checks:

```bash
node scripts/check-docs.mjs
node scripts/check-docs.mjs --source '/Volumes/New Volume/mahall-app'
```

With the Mintlify CLI available, run:

```bash
mint validate --telemetry=false
mint broken-links
mint dev --port 3005 --no-open
```

You can also use `npx --yes mint` for each CLI command. The local preview is `http://localhost:3005`. Check long guides and field accordions at desktop and mobile sizes, including finance settings, family registration, accounting reports, member sign-in, and platform account management.

## Maintain a guide

1. Read `AGENTS.md` and inspect the implemented workflow, including rendered forms, action handlers, validation, and access checks.
2. Write an English explanation and practical numbered instructions. Keep exact visible labels and explain required and conditional fields.
3. Explain errors, partial saves, and unavailable actions in plain language. Keep source paths, API details, and internal identifiers out of MDX pages.
4. Keep navigation and the guide directory up to date. Map every application route to its guide’s `guideSection` and `anchor` in the inventory.
5. Update source-review metadata only when the application behavior has actually been reviewed. Run checks and preview the result.

Keep work local unless publication is explicitly requested. Do not change application behavior, hosting, or access configuration as part of a documentation edit.
