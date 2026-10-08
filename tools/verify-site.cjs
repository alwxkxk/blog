'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

function verifySite(hexo) {
  const read = relative => {
    const file = path.join(hexo.public_dir, relative.endsWith('/') ? `${relative}index.html` : relative);
    assert.ok(fs.existsSync(file), `Missing output: ${relative}`);
    const contents = fs.readFileSync(file, 'utf8');
    assert.ok(contents.trim().length, `Empty output: ${relative}`);
    return contents;
  };
  const html = relative => new JSDOM(read(relative));
  const posts = hexo.model('Post').find({ published: true }).toArray();
  const hiddenField = hexo.config.hide_posts.filter;
  const hidden = posts.filter(post => post[hiddenField]);
  const publicPosts = posts.filter(post => !post[hiddenField]);
  assert.ok(posts.length, 'No posts generated.');
  assert.equal(new Set(posts.map(post => post.path)).size, posts.length, 'Duplicate post URLs.');
  read('css/style.css');
  read('js/jquery-3.3.1.min.js');
  read('js/waline3.8.js');
  const home = html('index.html');
  assert.equal(home.window.document.title, hexo.config.title, 'Missing or incorrect homepage title.');
  home.window.close();
  if (hexo.config.live2d?.enable) {
    read('live2dw/lib/L2Dwidget.min.js');
    const model = JSON.parse(read('live2dw/assets/hijiki.model.json'));
    for (const asset of [model.model, ...model.textures]) read(`live2dw/assets/${asset}`);
  }

  for (const post of posts) {
    const dom = html(post.path);
    const doc = dom.window.document;
    assert.ok(doc.querySelector('title')?.textContent, `Missing title: ${post.path}`);
    assert.ok(doc.querySelector('.post-content')?.innerHTML.trim(), `Empty article: ${post.path}`);
    const noindex = [...doc.querySelectorAll('meta[name="robots"]')]
      .some(meta => meta.content.includes('noindex'));
    assert.equal(noindex, Boolean(post[hiddenField]), `Incorrect noindex: ${post.path}`);
    for (const link of doc.querySelectorAll('.toc a[href^="#"]')) {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      assert.ok(doc.getElementById(id), `Broken table of contents: ${post.path}#${id}`);
    }
    dom.window.close();
  }

  for (const name of ['sitemap', 'baidusitemap']) {
    const config = hexo.config[name];
    if (config === false) continue;
    const dom = new JSDOM(read(config.path), { contentType: 'application/xml' });
    const urls = [...dom.window.document.querySelectorAll('loc')].map(node => node.textContent);
    assert.equal(new Set(urls).size, urls.length, `Duplicate URLs in ${config.path}`);
    for (const post of publicPosts.filter(post => post[name] !== false)) {
      assert.ok(urls.includes(post.permalink), `Missing sitemap URL: ${post.permalink}`);
    }
    for (const post of hidden) {
      assert.ok(!urls.includes(post.permalink), `Hidden post leaked into ${config.path}: ${post.path}`);
    }
    dom.window.close();
  }

  // Inspect the actual lists, including paginated category/tag/archive pages.
  const listRoutes = hexo.route.list().filter(route => /(?:^|\/)index\.html$/.test(route) &&
    !route.startsWith('posts/') && !route.startsWith('other/') && !route.startsWith('donate/'));
  const hiddenPaths = new Set(hidden.map(post => new URL(post.permalink).pathname.replace(/\/$/, '')));
  const listedPosts = new Set();
  for (const route of listRoutes) {
    const dom = html(route);
    for (const anchor of dom.window.document.querySelectorAll('.post-title a, .post-archive a')) {
      const url = new URL(anchor.getAttribute('href'), hexo.config.url);
      assert.ok(!hiddenPaths.has(url.pathname.replace(/\/$/, '')), `Hidden post listed on ${route}: ${url.pathname}`);
      listedPosts.add(url.pathname.replace(/\/$/, ''));
    }
    dom.window.close();
  }
  for (const post of publicPosts) {
    assert.ok(listedPosts.has(new URL(post.permalink).pathname.replace(/\/$/, '')), `Unlisted public post: ${post.path}`);
  }
  return { posts: posts.length, hidden: hidden.length };
}

module.exports = { verifySite };
