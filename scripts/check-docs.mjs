import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(join(root, 'docs.json'), 'utf8'));
const inventory = JSON.parse(readFileSync(join(root, 'reference/route-inventory.json'), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.name.startsWith('.') || e.name === 'node_modules' ? [] : e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
const files = walk(root).filter(f => f.endsWith('.mdx'));
const pages = new Map(files.map(f => [relative(root, f).slice(0, -4), readFileSync(f, 'utf8')]));
const anchorFor = heading => heading.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/ /g, '-');
const anchorsFor = text => {
  const counts = new Map();
  return [...text.matchAll(/^#{1,6} (.+)$/gm)].map(match => {
    const anchor = anchorFor(match[1]);
    const count = counts.get(anchor) ?? 0;
    counts.set(anchor, count + 1);
    return count === 0 ? anchor : `${anchor}-${count}`;
  });
};
const navigated = [];
function navigation(node) {
  if (typeof node === 'string') navigated.push(node);
  else if (Array.isArray(node)) node.forEach(navigation);
  else if (node) { for (const k of ['tabs', 'pages', 'groups']) if (node[k]) navigation(node[k]); }
}
navigation(config.navigation);
check(config.name === 'Mahallu Documentation', 'Unexpected documentation site name.');
check(config.navigation.tabs.map(t => t.tab).join('|') === 'Overview|Mahallu Admin|Control Panel|Mahallu Member|Marketing', 'Role tabs changed unexpectedly.');
for (const slug of navigated) check(pages.has(slug), `Missing navigation target: ${slug}`);
for (const [slug, text] of pages) {
  check(navigated.includes(slug), `Page absent from navigation: ${slug}`);
  check(/^---\n[\s\S]*?title: .+\n[\s\S]*?description: .+\n---/.test(text), `Incomplete frontmatter: ${slug}`);
  check(!/<\/?(?:Tabs|Tab)\b/.test(text), `Language tabs remain: ${slug}`);
  check(!/[\u0D00-\u0D7F]/.test(text), `Non-English guide content: ${slug}`);
  check(!/screen specifications?|implementation references?|API behavior|development team|Required marker|Target in source/i.test(text), `Developer specification content remains: ${slug}`);
  check(!/apps\/(?:web|api)\/|\.(?:tsx|ts)\b|ROOT_DOMAIN|\[tenant\]|\$\{/.test(text), `Implementation identifier remains: ${slug}`);
  check(!/\b(?:API|backend|JWT|DTO|React|localStorage)\b/.test(text), `Technical implementation prose remains: ${slug}`);
  for (const match of text.matchAll(/\]\((\/[^\s)]+)\)/g)) {
    const [path, fragment] = match[1].split('#');
    const target = path.slice(1);
    check(pages.has(target) || existsSync(join(root, target)), `Broken internal link ${match[1]} in ${slug}`);
    if (fragment && pages.has(target)) check(anchorsFor(pages.get(target)).includes(fragment), `Broken section link ${match[1]} in ${slug}`);
  }
}
const directory = pages.get('reference/coverage') ?? '';
for (const slug of navigated) check(directory.includes(`](/${slug})`), `Guide missing from directory: ${slug}`);
const sources = new Set();
for (const route of inventory.routes) {
  check(!sources.has(route.source), `Duplicate inventory source: ${route.source}`); sources.add(route.source);
  const text = pages.get(route.document) ?? '';
  check(pages.has(route.document), `Missing route guide: ${route.document}`);
  check(typeof route.guideSection === 'string' && route.guideSection.length > 0, `Missing guide section mapping: ${route.route}`);
  check(typeof route.anchor === 'string' && route.anchor.length > 0, `Missing guide anchor mapping: ${route.route}`);
  const headings = [...text.matchAll(/^## (.+)$/gm)].map(match => match[1]);
  check(headings.filter(heading => heading === route.guideSection).length === 1, `Guide section missing or duplicated: ${route.guideSection} in ${route.document}`);
  check(anchorFor(route.guideSection ?? '') === route.anchor, `Guide anchor differs from section: ${route.route}`);
}
const sourceIndex = process.argv.indexOf('--source');
if (sourceIndex !== -1) {
  if (!process.argv[sourceIndex + 1]) throw new Error('--source requires an application checkout path.');
  const app = resolve(process.argv[sourceIndex + 1]);
  const actual = walk(join(app, 'apps/web/src/app/sites')).filter(f => f.endsWith('/page.tsx')).map(f => relative(app, f));
  for (const source of actual) check(sources.has(source), `Undocumented application route: ${source}`);
  for (const source of sources) check(actual.includes(source), `Removed route remains in inventory: ${source}`);
  for (const [file, hash] of Object.entries(inventory.sourceHashes)) {
    const path = join(app, file);
    check(existsSync(path), `Referenced source missing: ${file}`);
    if (existsSync(path)) check(createHash('sha256').update(readFileSync(path)).digest('hex') === hash, `Source changed since review: ${file}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Passed: ${pages.size} English user guides, ${inventory.routes.length} route mappings, navigation and link checks${sourceIndex !== -1 ? ', application route and source hash checks' : ''}.`);
