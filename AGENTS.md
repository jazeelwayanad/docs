# Mahallu documentation instructions

## Purpose and source of truth

- This Mintlify site is an internal product guide and page-by-page screen specification for the development team.
- The application source is `/Volumes/New Volume/mahall-app`. Inspect it without modifying it during documentation tasks.
- Describe current implemented behavior. Distinguish proposed requirements from current behavior and obtain product input before defining new behavior.
- Cover the Overview, Mahallu Admin, Control Panel, Mahallu Member, and Marketing areas. Preserve existing documentation slugs when practical.
- Pages use MDX with YAML frontmatter. Site configuration and navigation live in `docs.json`.
- `reference/route-inventory.json` maps application page routes to specifications and records the reviewed source hashes. Update it when routes or relevant behavior change.

## Terminology

- Use **Mahallu** in prose. Preserve Mahalle, Mahall, tenant, and Ente Mahallu where they are exact UI labels or code identifiers.
- A **member** is a citizen record; a **user/account** is an authenticated operator identity. Do not confuse these entities.
- A **family** is a household unit; a **house** is a dwelling.
- Use the configured division term where relevant. Ward, zone, and division are not always fixed labels.
- Keep platform roles separate from tenant roles, and operational funds separate from ledger accounts.

## Page format and style

- Every page needs a title and a useful description in frontmatter.
- Combine user explanation and developer screen specification on the same page.
- Use `Tabs` with `Tab title="English"` and `Tab title="മലയാളം"`. Both tabs must cover the same screens, fields, rules, and gaps.
- Preserve exact UI labels, route parameters, input identifiers, and enum values in both languages.
- Each screen needs: purpose/access, layout in display order, fields/displayed information, actions, interaction sequence, states/rules, and implementation references.
- Group related screens on one documentation page only when each route remains explicitly documented. Describe redirect routes as navigation behavior.
- Use active voice and second person. Keep sentences concise and headings in sentence case.
- Bold UI labels in instructions. Use code formatting for file paths, routes, commands, and identifiers.
- Field tables must distinguish required UI markers from client validation and backend validation. Include conditional visibility and defaults when established by source.
- Keep implementation references in their dedicated section. Paths there are application-relative; documentation links are root-relative without `.mdx`.

## Verification rules

- Trace the route, rendered components, dialogs, data helpers, validators, API controllers, and relevant guards/services before describing a workflow.
- Imports alone do not prove that a component is rendered. Read the actual JSX and event bindings, including buttons attached to external forms.
- Never infer persistence from a success message. Identify local-state changes, fixed display data, missing handlers/destinations, and unfinished integrations explicitly.
- Identify partial multi-request behavior and suppressed errors. Do not describe such workflows as atomic or guaranteed to succeed.
- Document authorization as implemented. Sidebar visibility is not an API access check; role elevation and guard exceptions must be accounted for.
- Do not claim a browser journey was tested when it was only source-reviewed. Record the review date and source snapshot.
- Ask the product owner about unresolved intended behavior; do not invent it. Record a source-backed implementation gap without blocking unrelated documentation.
- Use current Mintlify guidance for components/configuration. Install its documentation skill with `npx skills add https://mintlify.com/docs` when needed. Use configured Mintlify MCP tools when available; local MDX edits are appropriate for local-only repository work.
- Run `node scripts/check-docs.mjs`, then `mint validate` and `mint broken-links`. Preview representative long/bilingual pages and check both language tabs.

## Content boundaries

- Include all existing screens, their forms/dialogs, related detail views, shared navigation, and observed failure/empty/loading states.
- Exclude a separate technical architecture handbook, installation guide for the application, and exhaustive API reference unless requested.
- Never include real credentials, tokens, personal records, or production infrastructure secrets. Use route/host templates and fictitious examples where necessary.
- Do not change application behavior, publish the site, or alter hosting/access configuration as part of a local documentation task.
