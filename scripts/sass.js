'use strict';

const sass = require('sass');
const { pathToFileURL } = require('node:url');

// Use Dart Sass's modern API; the old renderer calls the deprecated renderSync.
for (const extension of ['scss', 'sass']) {
  hexo.extend.renderer.register(extension, 'css', data => sass.compileString(data.text, {
    url: pathToFileURL(data.path),
    syntax: extension === 'sass' ? 'indented' : 'scss',
    style: 'expanded'
  }).css, true);
}
