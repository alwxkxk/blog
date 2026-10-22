'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const { patchDependencies } = require('../tools/patch-dependencies.cjs');
const { reviewAudit } = require('../tools/audit-security.cjs');
const root = path.resolve(__dirname, '..');

test('Every installed braces entry point rejects deeply nested strings and ASTs before stack exhaustion', () => {
  patchDependencies({ check: true });
  const result = spawnSync(process.execPath, ['-e', `
    const assert = require('node:assert/strict');
    const braces = require('braces');
    const safeFailure = error => error instanceof SyntaxError && /security limit/.test(error.message);
    for (const [open, close] of [['{', '}'], ['(', ')']]) {
      const pattern = open.repeat(4999) + 'x' + close.repeat(4999);
      for (const fn of [braces, braces.parse, braces.compile, braces.expand, braces.stringify]) {
        assert.throws(() => fn(pattern), safeFailure);
      }
    }
    for (const fn of [braces.compile, braces.expand, braces.stringify]) {
      let tree = { type: 'text', value: 'x' };
      for (let i = 0; i < 5000; i++) tree = { type: 'root', nodes: [tree] };
      assert.throws(() => fn(tree), safeFailure);
    }
    assert.deepEqual(braces.expand('post-{a,b}/{1..2}.md'), ['post-a/1.md','post-a/2.md','post-b/1.md','post-b/2.md']);
    assert.equal(braces.compile('a/{b,c}/d'), 'a/(b|c)/d');
    assert.equal(braces.stringify('"' + '{'.repeat(200) + '"'), '{'.repeat(200));
  `], { cwd: root, encoding: 'utf8', timeout: 5000, maxBuffer: 8192 });
  assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
});

test('All sprintf consumers reject excessive width/precision without coercing arguments, preserving normal formatting', () => {
  for (const consumer of ['hexo-i18n', 'hexo-abbrlink', 'hexo-directory-category']) {
    const fromConsumer = createRequire(require.resolve(`${consumer}/package.json`));
    const { sprintf, vsprintf } = fromConsumer('sprintf-js');
    for (const format of ['%1000000000s', '%.1000000000f', '%.1000000000g', '%(name)1000000000s', '%1$1000000000s']) {
      let called = false;
      assert.throws(() => sprintf(format, () => { called = true; return 1; }), /security limit/);
      assert.equal(called, false);
    }
    assert.equal(sprintf('%04d %.2f %s %%', 7, 1.234, '中文'), '0007 1.23 中文 %');
    assert.equal(vsprintf('%s: %d', ['文章', 130]), '文章: 130');
    assert.equal(sprintf('%(name)s', { name: '标题' }), '标题');
  }
});

test('Patched-source verification fails closed after tampering', () => {
  const base = fs.mkdtempSync(path.join(root, 'tmp/security-patch-test-'));
  try {
    const specs = require('../patches/dependencies.json');
    const packages = {};
    for (const spec of specs) {
      const location = `node_modules/${spec.name}`;
      packages[location] = { version: spec.version };
      for (const file of ['package.json', ...spec.files.map(item => item.path)]) {
        const target = path.join(base, location, file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(root, location, file), target);
      }
    }
    fs.writeFileSync(path.join(base, 'package-lock.json'), JSON.stringify({ packages }));
    assert.equal(patchDependencies({ root: base, check: true }).patchedFiles, 0);
    fs.appendFileSync(path.join(base, 'node_modules/braces/lib/parse.js'), '\n// tampered\n');
    assert.throws(() => patchDependencies({ root: base, check: true }), /missing or modified/);
    assert.throws(() => patchDependencies({ root: base }), /Unexpected upstream source/);
  } finally { fs.rmSync(base, { recursive: true, force: true }); }
});

test('Locked jQuery prevents prototype pollution and unsafe legacy HTML expansion', () => {
  const dom = new JSDOM('', { runScripts: 'outside-only' });
  try {
    dom.window.eval(fs.readFileSync(require.resolve('jquery/dist/jquery.min.js'), 'utf8'));
    const pollution = dom.window.eval(`(() => {
      jQuery.extend(true, {}, JSON.parse('{"__proto__":{"securityPolluted":true}}'));
      return ({}).securityPolluted;
    })()`);
    assert.equal(pollution, undefined);
    const html = '<style><style /><img src=x onerror="alert(1)">';
    assert.equal(dom.window.jQuery.htmlPrefilter(html), html);
  } finally { dom.window.close(); }
});

test('Replacement navbar supports mobile toggle, sibling menus and keyboard dismissal without interpreting data targets', () => {
  const html = require('pug').renderFile(path.join(root, 'themes/maupassant/layout/_widget/navbar.pug'));
  const dom = new JSDOM(html + '<button id="outside" data-toggle="dropdown">Outside</button>', { runScripts: 'outside-only' });
  try {
    const { window: win } = dom;
    const doc = win.document;
    win.eval(fs.readFileSync(path.join(root, 'themes/maupassant/source/js/navigation.js'), 'utf8'));
    const button = doc.querySelector('.navbar-toggle');
    const panel = doc.querySelector('.navbar-collapse');
    button.dataset.target = '<img src=x onerror=alert(1)>';
    button.click();
    assert.ok(panel.classList.contains('in'));
    assert.equal(button.getAttribute('aria-expanded'), 'true');
    assert.equal(doc.querySelector('img'), null);
    const [first, second] = doc.querySelectorAll('.navbar-nav > .dropdown > .dropdown-toggle');
    first.click();
    assert.ok(first.parentElement.classList.contains('open'));
    second.click();
    assert.equal(first.getAttribute('aria-expanded'), 'false');
    second.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.equal(doc.activeElement, second.parentElement.querySelector('.dropdown-menu a'));
    const firstLink = doc.activeElement;
    firstLink.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.notEqual(doc.activeElement, firstLink);
    doc.activeElement.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(second.getAttribute('aria-expanded'), 'false');
    assert.equal(doc.activeElement, second);
    first.click();
    const submenu = first.parentElement.querySelector('.dropdown-submenu > .dropdown-toggle');
    submenu.click();
    assert.equal(submenu.getAttribute('aria-expanded'), 'true');
    submenu.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(submenu.getAttribute('aria-expanded'), 'false');
    assert.equal(first.getAttribute('aria-expanded'), 'true');
    doc.getElementById('outside').click();
    assert.equal(first.getAttribute('aria-expanded'), 'false');
    button.click();
    assert.equal(panel.classList.contains('in'), false);
  } finally { dom.window.close(); }
});

test('Updated ECharts renders the article line-chart configuration with escaped labels', () => {
  const echarts = require('echarts');
  const chart = echarts.init(null, null, { renderer: 'svg', ssr: true, width: 600, height: 400 });
  try {
    chart.setOption({ animation: false, title: { text: '实时温度 <script>' },
      xAxis: { type: 'category', data: ['1:00', '1:01'] }, yAxis: { type: 'value' },
      series: [{ type: 'line', smooth: true, data: [20, 21] }] });
    const svg = chart.renderToSVGString();
    assert.match(svg, /实时温度/);
    assert.ok(!svg.includes('<script>'));
    assert.match(svg, /<path/);
  } finally { chart.dispose(); }
});

test('Audit exceptions require patched locations and never hide unrelated advisories or registry errors', () => {
  const vulnerability = { nodes: ['node_modules/braces'], via: [{
    url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm', severity: 'high'
  }] };
  const audit = { metadata: { vulnerabilities: { high: 1 } }, vulnerabilities: { braces: vulnerability } };
  assert.equal(reviewAudit(audit, ['node_modules/braces']).unexpected.length, 0);
  assert.equal(reviewAudit(audit, []).unexpected.length, 1);
  vulnerability.via.push({ url: 'https://example.invalid/new-advisory', severity: 'high' });
  assert.equal(reviewAudit(audit, ['node_modules/braces']).unexpected.length, 1);
  assert.throws(() => reviewAudit({ error: { summary: 'offline' } }, []), /offline/);
});
