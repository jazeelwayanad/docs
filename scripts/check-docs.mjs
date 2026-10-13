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
const navigated = [];
function navigation(node) {
  if (typeof node === 'string') navigated.push(node);
  else if (Array.isArray(node)) node.forEach(navigation);
  else if (node) { for (const k of ['tabs', 'pages', 'groups']) if (node[k]) navigation(node[k]); }
}
navigation(config.navigation);
check(config.navigation.tabs.map(t => t.tab).join('|') === 'Overview|Mahallu Admin|Control Panel|Mahallu Member|Marketing', 'Role tabs changed unexpectedly.');
for (const slug of navigated) check(pages.has(slug), `Missing navigation target: ${slug}`);
for (const [slug, text] of pages) {
  check(navigated.includes(slug), `Page absent from navigation: ${slug}`);
  check(/^---\n[\s\S]*?title: .+\n[\s\S]*?description: .+\n---/.test(text), `Incomplete frontmatter: ${slug}`);
  check(text.includes('<Tab title="English">') && text.includes('<Tab title="മലയാളം">'), `Missing language tabs: ${slug}`);
  const en = text.split('<Tab title="English">')[1]?.split('</Tab>')[0] ?? '';
  const ml = text.split('<Tab title="മലയാളം">')[1]?.split('</Tab>')[0] ?? '';
  check(/[\u0D00-\u0D7F]/.test(ml), `Malayalam content missing: ${slug}`);
  check((en.match(/^## /gm) || []).length === (ml.match(/^## /gm) || []).length, `Screen/section parity differs: ${slug}`);
  check((en.match(/^\|/gm) || []).length === (ml.match(/^\|/gm) || []).length, `Table parity differs: ${slug}`);
  for (const match of text.matchAll(/\]\((\/[^\s)]+)\)/g)) {
    const target = match[1].split('#')[0].slice(1);
    check(pages.has(target) || existsSync(join(root, target)), `Broken internal link ${match[1]} in ${slug}`);
  }
}
const sources = new Set();
for (const route of inventory.routes) {
  check(!sources.has(route.source), `Duplicate inventory source: ${route.source}`); sources.add(route.source);
  const text = pages.get(route.document) ?? '';
  check(pages.has(route.document), `Missing route specification: ${route.document}`);
  check(text.includes('Route: `' + route.route + '`'), `Route not described: ${route.route} in ${route.document}`);
  check((text.match(new RegExp('^## ' + route.screen.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'gm')) || []).length === 2, `Screen missing in a language: ${route.screen}`);
}
const sourceIndex = process.argv.indexOf('--source');
if (sourceIndex !== -1) {
  const app = resolve(process.argv[sourceIndex + 1] ?? '');
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
else console.log(`Passed: ${pages.size} bilingual pages, ${inventory.routes.length} route mappings, navigation and link checks${sourceIndex !== -1 ? ', application route and source hash checks' : ''}.`);
