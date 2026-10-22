'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { patchDependencies } = require('./patch-dependencies.cjs');

// Only these exact upstream advisories have checked local patches. New findings
// fail CI; a broad package/severity allowlist would hide unrelated vulnerabilities.
const patchedAdvisories = new Map([
  ['https://github.com/advisories/GHSA-vfj7-8cjw-p6xm', 'braces'],
  ['https://github.com/advisories/GHSA-hp3w-g68c-fv3c', 'sprintf-js']
]);

function reviewAudit(audit, patchedLocations) {
  assert.ok(!audit.error, `npm audit failed: ${audit.error?.summary || 'registry error'}`);
  assert.ok(audit.metadata?.vulnerabilities && audit.vulnerabilities, 'Incomplete npm audit response.');
  const entries = Object.entries(audit.vulnerabilities);
  const unexpected = [];
  const mitigated = new Set();
  for (const [name, vulnerability] of entries) {
    assert.ok(vulnerability.via?.length, `Missing advisory details for ${name}.`);
    for (const advisory of vulnerability.via) {
      if (typeof advisory === 'string') {
        assert.ok(audit.vulnerabilities[advisory], `Missing transitive advisory: ${advisory}`);
        continue;
      }
      const patchedName = patchedAdvisories.get(advisory.url);
      if (name === patchedName && vulnerability.nodes?.length &&
        vulnerability.nodes.every(location => patchedLocations.includes(location))) {
        mitigated.add(advisory.url);
      } else {
        unexpected.push({ package: name, severity: advisory.severity, url: advisory.url, title: advisory.title });
      }
    }
  }
  return { upstreamCounts: audit.metadata.vulnerabilities,
    locallyMitigatedAdvisories: [...mitigated], unexpected };
}

if (require.main === module) {
  try {
    const root = path.resolve(__dirname, '..');
    const { checked } = patchDependencies({ check: true, root });
    const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['audit', '--json', '--include=dev', '--cache', path.join(root, 'tmp/npm-cache')],
      { cwd: root, encoding: 'utf8', timeout: 60000, maxBuffer: 5 * 1024 * 1024 });
    if (result.error) throw result.error;
    assert.ok(result.status === 0 || result.status === 1, `npm audit exited ${result.status}: ${result.stderr}`);
    const review = reviewAudit(JSON.parse(result.stdout), checked);
    console.log(JSON.stringify(review, null, 2));
    assert.equal(review.unexpected.length, 0, 'Unpatched dependency advisories found.');
    console.log('Only the listed, hash-verified local mitigations are excepted; upstream version alerts remain visible.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { reviewAudit };
