'use strict';

// Keep the existing submission URL without loading a second, obsolete Hexo.
const escapeXml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
})[char]);

hexo.extend.generator.register('baidusitemap', function (locals) {
  const config = this.config.baidusitemap;
  if (config === false) return [];

  const base = new URL(config?.url || this.config.url);
  base.pathname = this.config.root;
  const hiddenField = this.config.hide_posts?.filter || 'hidden';
  const posts = [...locals.posts.toArray(), ...locals.pages.toArray()]
    .filter(post => post.baidusitemap !== false && !post[hiddenField])
    .sort((a, b) => (b.updated || b.date) - (a.updated || a.date));

  const entries = posts.map(post => {
    const url = new URL(post.path, base).href;
    const date = (post.updated || post.date).toDate().toISOString().slice(0, 10);
    return `  <url><loc>${escapeXml(url)}</loc><lastmod>${date}</lastmod></url>`;
  });

  return {
    path: config?.path || 'baidusitemap.xml',
    data: '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      entries.join('\n') + '\n</urlset>\n'
  };
});
