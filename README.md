# 生子当如哈士奇的个人站点

记录技术文章，以及《软硬结合——从零打造物联网》《3D 可视化教程》两个系列教程。

- 主站：https://www.scaugreen.cn/
- 备用访问：https://alwxkxk.github.io/blog/posts/23630/

## 环境与安装

使用 **Node.js 24 LTS、npm 11**。项目依赖与插件由根目录的 `package.json` 和 `package-lock.json` 统一管理，不需要全局安装 Hexo，也不需要进入主题目录安装依赖。

```bash
nvm install
nvm use
npm ci
```

`.nvmrc` 指定 Node 24，CI 会使用该系列当前可用的补丁版本。npm 缓存保存在项目内 `tmp/npm-cache/`，测试和升级临时文件也只放在 `tmp/`，该目录已忽略。

## 写作与预览

```bash
# 新建文章，也可用 --path 指定 _posts 下的子目录
npx hexo new "新文章标题"
npx hexo new "新文章标题" --path "分类/新文章标题.md"

# 本地预览，默认 http://localhost:4000/
npm run dev
```

首次渲染新文章时，`hexo-abbrlink` 会将短链接写入 front-matter，需随文章一起提交。已有文章的 `abbrlink` 保持不变。

分类默认从 `source/_posts/` 下的目录层级生成；`auto_dir_categorize.force: false` 会保留文章显式填写的分类。`hidden: true` 的文章仍生成独立页面，但不出现在公开列表、站点地图，并附带 `noindex`。

## 测试与构建

```bash
npm test
npm run build
```

`npm run build` 通过 `tools/build.cjs` 执行干净构建，清理本地生成目录 `public/` 和缓存 `db.json` 后重新生成。它会把 Hexo 的插件加载错误视为失败，并检查主题 CSS、文章页面、短链接重复、目录锚点、公开列表、隐藏文章和两份站点地图。产物位于 `public/`。

`npm test` 使用项目内的临时副本验证新建文章、短链接稳定性、多级/手工分类、Sass、百度 sitemap、构建失败处理和 Service Worker 缓存迁移。

依赖变更后更新并提交 `package-lock.json`；常规安装使用 `npm ci`，不再使用旧 `yarn.lock`。不要执行 `npm audit fix --force` 自动降级或跨版本替换 Hexo；当前上游审计限制见 [update.md](update.md)。

## 主题与静态资源

主题源自 [maupassant-hexo](https://github.com/tufu9441/maupassant-hexo)，本项目包含大量定制，升级时不要直接覆盖整个主题目录。

- 导航栏：`themes/maupassant/layout/_widget/navbar.pug`。
- 样式：`themes/maupassant/source/css/style.scss`，由 `scripts/sass.js` 使用 Dart Sass 现代接口编译。
- 文章图片：`themes/maupassant/source/blog_images/`。
- 评论：`themes/maupassant/layout/_partial/comments.pug`，保留现有 Waline 服务与文章路径。
- Live2D：静态资源位于 `themes/maupassant/source/live2dw/`，通过 `_config.yml` 的 `live2d.enable` 开关控制；来源和许可证见主题内 `VENDORED_ASSETS.md`。
- 百度站点地图：`scripts/baidu-sitemap.js` 保留 `baidusitemap.xml`，不再安装依赖 Hexo 3 的旧生成器。

变更主题资源时更新主题配置中的 `version`；变更 Service Worker 缓存资源时更新 `source/sw.js` 中的缓存版本。新版 Worker 会清理本博客的旧缓存，联网优先获取新版资源，离线使用当前版本缓存。

## 部署

`.github/workflows/pages.yml` 在指向 `master` 的 PR 中安装、测试和构建，在 `master` 推送或手动触发时验证后发布 `public/` 到 **`server-pages`** 分支。服务器继续使用原有分支消费方式。本次升级没有更改域名、文章 URL 或实际发布线上站点。

当前工作流只构建主站的 `root: /`。备用站 `root: /blog/` 仍需单独适配：导航、评论模块和 Service Worker 中有根绝对路径，不能只改 `_config.yml` 的 `root` 就发布。历史 README 中基于 Node 12 的 `gh-pages-dev` 示例已移除；当前配置以实际工作流为准。

正式发布前保留上一版静态文件与部署提交；回滚优先重新发布已保存的静态产物，并核对浏览器缓存。
