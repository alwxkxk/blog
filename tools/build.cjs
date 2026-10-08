'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Hexo = require('hexo');
const { verifySite } = require('./verify-site.cjs');

async function build(base = path.resolve(__dirname, '..')) {
  assert.equal(Number(process.versions.node.split('.')[0]), 24, 'Use Node.js 24 LTS (see .nvmrc).');
  const hexo = new Hexo(path.resolve(base));
  const errors = [];
  const logError = hexo.log.error.bind(hexo.log);
  hexo.log.error = (...args) => {
    errors.push(args);
    logError(...args);
  };
  const checkErrors = () => assert.equal(errors.length, 0,
    `Hexo reported ${errors.length} error(s); refusing to publish an incomplete site.`);

  try {
    await hexo.init();
    checkErrors();
    // Do not let stale CSS, old routes or an incompatible db.json hide failures.
    await hexo.call('clean');
    await hexo.call('generate');
    checkErrors();
    const result = verifySite(hexo);
    console.log(`Verified ${result.posts} posts (${result.hidden} hidden), sitemaps and theme assets.`);
    return result;
  } finally {
    await hexo.exit();
  }
}

if (require.main === module) {
  const tmp = path.resolve(__dirname, '../tmp');
  fs.mkdirSync(tmp, { recursive: true });
  process.env.TMPDIR = tmp;
  build(process.argv[2]).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { build };
