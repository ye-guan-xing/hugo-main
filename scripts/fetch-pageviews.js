const fs = require('fs');
const path = require('path');

const SERVER_URL = 'https://www.acyeapp.top';
const POST_DIR = path.join(process.cwd(), 'content/post');
const OUT = path.join(process.cwd(), 'data/pageviews.json');

function getSlug(dir, file) {
  const content = fs.readFileSync(file, 'utf8');
  const m = content.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
  return m ? m[1].trim() : dir;
}

async function fetchCount(p) {
  const url = `${SERVER_URL}/api/article?path=${encodeURIComponent(p)}&type=time&lang=zh-cn`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const json = await res.json();
    if (json.errno === 0 && json.data != null) {
      const row = Array.isArray(json.data) ? json.data[0] : json.data;
      return typeof row === 'number' ? row : Number(row && row.time) || 0;
    }
  } catch (_) {
  } finally {
    clearTimeout(timer);
  }
  return 0;
}

(async () => {
  const result = {};
  const dirs = fs.readdirSync(POST_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'));
  for (const d of dirs) {
    const idx = path.join(POST_DIR, d.name, 'index.md');
    if (!fs.existsSync(idx)) continue;
    const slug = getSlug(d.name, idx);
    const p = `/p/${slug}/`;
    result[p] = await fetchCount(p);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`Wrote ${Object.keys(result).length} pageviews to ${OUT}`);
})();
