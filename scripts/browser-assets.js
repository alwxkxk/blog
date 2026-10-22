'use strict';

const fs = require('node:fs');

// Versions and integrity are managed by package-lock.json and npm audit.
hexo.extend.generator.register('browser-assets', () => [
  ['js/jquery.min.js', 'jquery/dist/jquery.min.js'],
  ['js/echarts.min.js', 'echarts/dist/echarts.min.js'],
  ['licenses/jquery.txt', 'jquery/LICENSE.txt'],
  ['licenses/echarts.txt', 'echarts/LICENSE'],
  ['licenses/echarts-NOTICE.txt', 'echarts/NOTICE']
].map(([path, module]) => ({ path, data: fs.readFileSync(require.resolve(module)) })));
