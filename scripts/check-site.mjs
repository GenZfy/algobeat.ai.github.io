import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'public/index.html',
  'public/styles.css',
  'public/script.js',
  'public/_headers',
  'public/robots.txt',
  'public/sitemap.xml'
];

await Promise.all(requiredFiles.map(file => access(file)));
const html = await readFile('public/index.html', 'utf8');
const checks = [
  ['document title', /<title>[^<]+<\/title>/],
  ['meta description', /<meta name="description"/],
  ['single h1', html.match(/<h1\b/g)?.length === 1],
  ['main landmark', /<main\b/],
  ['canonical URL', /rel="canonical"/]
];
const failures = checks.filter(([, check]) => check instanceof RegExp ? !check.test(html) : !check);
if (failures.length) {
  console.error(`Site checks failed: ${failures.map(([name]) => name).join(', ')}`);
  process.exit(1);
}
console.log(`Site checks passed (${checks.length} HTML checks, ${requiredFiles.length} required files).`);
