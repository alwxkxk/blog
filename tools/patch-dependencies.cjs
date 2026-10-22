'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const patches = require('../patches/dependencies.json');

const hash = source => createHash('sha256').update(source).digest('hex');

function patchDependencies({ check = false, root = path.resolve(__dirname, '..') } = {}) {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const writes = [];
  const checked = [];
  for (const patch of patches) {
    const installs = Object.entries(lock.packages).filter(([location]) =>
      location === `node_modules/${patch.name}` || location.endsWith(`/node_modules/${patch.name}`));
    assert.ok(installs.length, `No ${patch.name} installation found; review the security patch configuration.`);
    for (const [location, metadata] of installs) {
      assert.equal(metadata.version, patch.version, `Review security patch for ${location}@${metadata.version}.`);
      const installed = JSON.parse(fs.readFileSync(path.join(root, location, 'package.json'), 'utf8'));
      assert.equal(installed.version, patch.version, `Installed version differs from lock: ${location}`);
      for (const file of patch.files) {
        const target = path.join(root, location, file.path);
        let contents = fs.readFileSync(target, 'utf8');
        if (hash(contents) === file.patchedSha256) continue;
        assert.ok(!check, `Security patch missing or modified: ${target}. Run npm ci with lifecycle scripts enabled.`);
        assert.equal(hash(contents), file.originalSha256, `Unexpected upstream source: ${target}; refusing to patch.`);
        for (const [before, after] of file.replacements) {
          assert.equal(contents.split(before).length, 2, `Patch context is not unique: ${target}`);
          contents = contents.replace(before, after);
        }
        assert.equal(hash(contents), file.patchedSha256, `Incorrect patched source: ${target}`);
        writes.push([target, contents]);
      }
      checked.push(location);
    }
  }
  // Validate every source before writing any of them. Repeated installs are safe.
  for (const [target, contents] of writes) fs.writeFileSync(target, contents);
  return { checked, patchedFiles: writes.length };
}

if (require.main === module) {
  try {
    const result = patchDependencies({ check: process.argv.includes('--check') });
    console.log(`Security patches verified for ${result.checked.length} dependency installations (${result.patchedFiles} files patched).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { patchDependencies };
