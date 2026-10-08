'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const { verifySite } = require('../tools/verify-site.cjs');

const root = path.resolve(__dirname, '..');
const tempRoot = path.join(root, 'tmp');
fs.mkdirSync(tempRoot, { recursive: true });

function loadPlugin(file, hexo) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts', file), 'utf8'), {
    hexo, require, URL, console
  }, { filename: file });
}

test('Baidu sitemap preserves the submission URL, filters private posts and escapes XML', () => {
  let generator;
  loadPlugin('baidu-sitemap.js', { extend: { generator: { register: (_name, fn) => { generator = fn; } } } });
  const date = { toDate: () => new Date('2026-10-08T00:00:00Z'), valueOf: () => 1 };
  const posts = [
    { path: 'posts/123/', date },
    { path: 'posts/hidden/', date, hidden: true },
    { path: 'posts/excluded/', date, baidusitemap: false },
    { path: '文章/?a=1&b=2', date }
  ];
  const context = { config: {
    url: 'https://example.com/blog/', root: '/blog/',
    baidusitemap: { path: 'baidusitemap.xml' }, hide_posts: { filter: 'hidden' }
  } };
  const result = generator.call(context, { posts: { toArray: () => posts }, pages: { toArray: () => [] } });
  assert.equal(result.path, 'baidusitemap.xml');
  const dom = new JSDOM(result.data, { contentType: 'application/xml' });
  assert.deepEqual([...dom.window.document.querySelectorAll('loc')].map(node => node.textContent), [
    'https://example.com/blog/posts/123/', 'https://example.com/blog/%E6%96%87%E7%AB%A0/?a=1&b=2'
  ]);
  assert.match(result.data, /&amp;b=2/);
  assert.equal(dom.window.document.querySelector('lastmod').textContent, '2026-10-08');
  dom.window.close();
});

test('Dart Sass compiles both SCSS and indented Sass with the modern API', () => {
  const renderers = {};
  loadPlugin('sass.js', { extend: { renderer: { register: (extension, _output, fn) => { renderers[extension] = fn; } } } });
  for (const [extension, text] of [
    ['scss', '$accent: #123456; .post { color: $accent; .title { font-weight: bold; } }'],
    ['sass', '$accent: #123456\n.post\n  color: $accent\n  .title\n    font-weight: bold\n']
  ]) {
    const css = renderers[extension]({ text, path: path.join(tempRoot, `example.${extension}`) });
    assert.match(css, /color: #123456/);
    assert.match(css, /\.post \.title/);
  }
});

test('A plugin load failure fails the build before deleting a previously working output', () => {
  const base = fs.mkdtempSync(path.join(tempRoot, 'broken-plugin-'));
  try {
    fs.mkdirSync(path.join(base, 'scripts'));
    fs.mkdirSync(path.join(base, 'public'));
    fs.writeFileSync(path.join(base, 'package.json'), JSON.stringify({ name: 'broken-fixture', hexo: { version: '8.1.2' } }));
    fs.writeFileSync(path.join(base, '_config.yml'), 'url: https://example.com\ntheme: ""\n');
    fs.writeFileSync(path.join(base, 'scripts/broken.js'), 'throw new Error("Intentional plugin failure");');
    fs.writeFileSync(path.join(base, 'public/index.html'), 'previous working output');
    const result = spawnSync(process.execPath, [path.join(root, 'tools/build.cjs'), base], {
      encoding: 'utf8', env: { ...process.env, TMPDIR: tempRoot }, timeout: 30000
    });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /refusing to publish an incomplete site/);
    assert.equal(fs.readFileSync(path.join(base, 'public/index.html'), 'utf8'), 'previous working output');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('Missing theme CSS cannot pass output verification', () => {
  const base = fs.mkdtempSync(path.join(tempRoot, 'missing-css-'));
  try {
    assert.throws(() => verifySite({
      public_dir: base, config: { hide_posts: { filter: 'hidden' } },
      model: () => ({ find: () => ({ toArray: () => [{ path: 'posts/1/' }] }) })
    }), /Missing output: css\/style.css/);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

function serviceWorker() {
  const handlers = {};
  const stores = new Map();
  const state = { claimed: false, online: true };
  const fetch = async () => {
    if (!state.online) throw new Error('offline');
    return { ok: true, type: 'basic', body: 'new asset', clone() { return this; } };
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'themes/maupassant/source/sw.js'), 'utf8'), {
    URL, fetch,
    self: {
      location: { origin: 'https://example.com' },
      addEventListener: (name, fn) => { handlers[name] = fn; },
      skipWaiting: async () => {}, clients: { claim: async () => { state.claimed = true; } }
    },
    caches: {
      keys: async () => [...stores.keys()], delete: async name => stores.delete(name),
      open: async name => {
        if (!stores.has(name)) stores.set(name, new Map());
        return {
          match: async request => stores.get(name).get(request.url),
          put: async (request, response) => stores.get(name).set(request.url, response)
        };
      }
    }
  });
  return { handlers, stores, state };
}

test('Service Worker retires old blog caches without deleting unrelated caches', async () => {
  const { handlers, stores, state } = serviceWorker();
  stores.set('my-site-cache-2021-02-14', new Map());
  stores.set('another-app', new Map());
  let pending;
  handlers.activate({ waitUntil: value => { pending = value; } });
  await pending;
  assert.equal(stores.has('my-site-cache-2021-02-14'), false);
  assert.equal(stores.has('another-app'), true);
  assert.equal(state.claimed, true);
});

test('Service Worker refreshes assets online, falls back offline, and ignores external APIs', async () => {
  const { handlers, state } = serviceWorker();
  const request = { method: 'GET', url: 'https://example.com/js/example.min.js' };
  let response;
  const event = { request, respondWith: value => { response = value; } };
  handlers.fetch(event);
  assert.equal((await response).body, 'new asset');
  state.online = false;
  handlers.fetch(event);
  assert.equal((await response).body, 'new asset');
  handlers.fetch({
    request: { method: 'GET', url: 'https://comments.example.com/api.json' },
    respondWith: () => assert.fail('External APIs must not be cached')
  });
});
