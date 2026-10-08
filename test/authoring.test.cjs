'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const Hexo = require('hexo');

const root = path.resolve(__dirname, '..');
const tempRoot = path.join(root, 'tmp');

test('New articles keep stable short links, directory categories and manual categories', async () => {
  fs.mkdirSync(tempRoot, { recursive: true });
  const base = fs.mkdtempSync(path.join(tempRoot, 'authoring-'));
  try {
    for (const name of ['themes', 'scaffolds', 'scripts']) {
      fs.cpSync(path.join(root, name), path.join(base, name), { recursive: true });
    }
    for (const name of ['package.json', '_config.yml']) fs.copyFileSync(path.join(root, name), path.join(base, name));
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(base, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
    const hexo = new Hexo(base, { silent: true });
    let created;
    try {
      await hexo.init();
      created = await hexo.post.create({ title: '升级验证新文章', path: '专题/Node/新文章.md' });
      fs.appendFileSync(created.path, '\n## 中文标题\n\n正常正文。\n');
    } finally {
      await hexo.exit();
    }
    const manual = path.join(base, 'source/_posts/专题/手工分类.md');
    fs.writeFileSync(manual, '---\ntitle: 手工分类\ndate: 2026-01-01\ncategories:\n  - 手工分类\n---\n\n手工分类正文。\n');
    fs.writeFileSync(path.join(base, 'source/_posts/隐藏.md'), '---\ntitle: 隐藏测试\ndate: 2026-01-02\nhidden: true\n---\n\n隐藏正文。\n');
    const run = () => {
      const result = spawnSync(process.execPath, [path.join(root, 'tools/build.cjs'), base], {
        encoding: 'utf8', timeout: 60000, env: { ...process.env, TMPDIR: tempRoot }
      });
      assert.equal(result.status, 0, result.stdout + result.stderr);
    };
    run();
    const source = fs.readFileSync(created.path, 'utf8');
    assert.match(source, /^abbrlink: ['"]?\d+/m);
    const db = JSON.parse(fs.readFileSync(path.join(base, 'db.json'))).models;
    const names = Object.fromEntries(db.Category.map(category => [category._id, category.name]));
    const categories = title => {
      const post = db.Post.find(post => post.title === title);
      return db.PostCategory.filter(link => link.post_id === post._id).map(link => names[link.category_id]);
    };
    assert.deepEqual(categories('升级验证新文章'), ['专题', 'Node']);
    assert.deepEqual(categories('手工分类'), ['手工分类']);
    run();
    assert.equal(fs.readFileSync(created.path, 'utf8'), source, 'Rebuilding must not regenerate the short link.');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});
