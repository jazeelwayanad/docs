# Mahallu documentation instructions

## Purpose and source of truth

- This Mintlify site is a complete English user guide for Mahallu administrators, accountants, platform operators, members, and prospective customers.
- Explain how to use the product. Do not turn pages into developer screen specifications or expose implementation references, API details, source paths, internal input identifiers, or application route templates.
- The application source is `/Volumes/New Volume/mahall-app`. Inspect it without modifying it during documentation tasks.
- Describe current implemented behavior. Explain unfinished features in plain language without promising that they save changes or complete a workflow. Obtain product input before defining new behavior.
- Cover Overview, Mahallu Admin, Control Panel, Mahallu Member, and Marketing. Preserve existing documentation slugs when practical.
- Pages use MDX with YAML frontmatter. Site configuration and navigation live in `docs.json`.
- `reference/route-inventory.json` is maintenance data, not a reader-facing API or route guide. It maps application routes to user-guide sections and records reviewed source hashes. Update mappings when guides move; update source hashes and source-review dates only after reviewing the relevant behavior.
- Keep documentation-format updates separate from application-review metadata. Do not claim a new application review merely because prose was rewritten.

## Terminology

- Use **Mahallu** in prose. Preserve Mahalle, Mahall, tenant, and Ente Mahallu where they are exact UI labels.
- A **member** is a citizen record; a **user/account** is an authenticated operator identity.
- A **family** is a household unit; a **house** is a dwelling.
- Use the configured division term where relevant. Ward, zone, and division are not fixed labels.
- Keep platform roles separate from Mahallu roles, and operational funds separate from ledger accounts.

## Page format and style

- Every page needs a useful title and description in frontmatter.
- Write in English only. Do not add language-selection tabs or Malayalam content.
- Lead with what the reader can do. State prerequisites and access needs, give numbered task steps, explain relevant fields and choices, and cover errors and current limitations.
- Document forms, dialogs, filters, detail views, and related records. Group related screens when helpful, but give every mapped screen its own meaningful section.
- Explain redirects as what happens after navigation or sign-in, without exposing route templates.
- Use active voice and second person. Keep sentences concise and headings in sentence case.
- Bold exact UI labels in instructions. Link to other guides using root-relative paths without `.mdx`.
- Keep field tables useful to users: labels, required information, choices, defaults, and conditional details. Distinguish visible required markers from additional saving requirements when they differ, using plain language.
- Use accordions for long optional field references. Avoid repeating the same form on multiple pages when a link to its complete guide is sufficient.
- The guide directory at `reference/coverage.mdx` lists user guides, not application routes or implementation gaps.

## Verification rules

- Trace the route, rendered components, dialogs, data helpers, validators, API controllers, and relevant guards/services before describing uncertain workflows.
- Imports alone do not prove a component is rendered. Read actual JSX and event bindings, including buttons attached to external forms.
- Never infer persistence from a success message. Explain preview-only controls, fixed example data, unavailable actions, and unfinished integrations in user-facing terms.
- Identify partial saves and suppressed failures. Tell readers to check existing records before retrying a partly completed operation.
- Describe access as implemented. Navigation visibility does not establish authorization; platform access and permission exceptions must be considered during source review.
- Do not claim a browser journey was tested when only source was reviewed. Keep source snapshots and review dates in maintenance records.
- Record source-backed limitations without blocking unrelated documentation. Ask the product owner about intended behavior only when it is necessary to define new requirements.
- Use current Mintlify guidance for components and configuration. Install its documentation skill with `npx skills add https://mintlify.com/docs` when needed. Prefer configured Mintlify MCP tools when available; local MDX edits are appropriate for this repository.
- Run `node scripts/check-docs.mjs`, then its `--source` mode against the application checkout, then `mint validate` and `mint broken-links`.
- Preview representative long guides, field accordions, forms, accounting reports, member guides, and Control Panel guides at desktop and mobile sizes.

## Content boundaries

- Include all existing screens and their forms, dialogs, related detail views, navigation, and observed failure, empty, and loading states relevant to a reader.
- Exclude a technical architecture handbook, application installation guide, exhaustive API reference, and source-code references from the user documentation.
- Never include real credentials, tokens, personal records, or production infrastructure secrets. Use fictitious examples.
- Do not change application behavior, publish the site, or alter hosting/access configuration as part of a local documentation task.
