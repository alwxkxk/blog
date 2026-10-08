# Hexo 项目升级与影响评估

评估日期：2026-10-08。代码基线：`f3e26de`。本文基于仓库配置、已安装依赖、文章与主题源码、临时副本构建，以及 npm 官方注册表和上游发布说明。

## 0. 升级实施结果（2026-10-08）

**本地升级已完成：Hexo 8.1.2 + Node 24 LTS，保留原有定制主题与文章地址。尚未提交 Git、推送或发布线上站点。** 下方第 1–10 节保留为升级前评估；本节记录实际完成情况，取代其中“尚未进行新版构建”等历史状态。

### 已实施的变更

- 根依赖升级至 Hexo 8.1.2、Pug renderer 3.0.0、Marked renderer 7.0.1，以及新版 archive/category/index/tag/sitemap/server/hide-posts 插件。
- `.nvmrc` 和 `engines` 统一到 Node 24；新增 npm v3 格式锁文件 `package-lock.json`。npm 官方注册表为安装源，缓存固定在项目 `tmp/npm-cache/`；常规安装改用 `npm ci`。
- 移除根级与传递的 Node Sass、无使用来源的 EJS/Stylus renderer、主题内 Hexo 3 时代的依赖声明。
- 实测 `hexo-renderer-sass@0.5.0` 仍调用弃用的 legacy JS API，最终采用 **`sass@1.105.1` + `scripts/sass.js`**，通过现代 `compileString` 接口编译 SCSS/Sass，无 legacy API 构建警告。
- 移除依赖 Hexo 3 的百度 sitemap 包，使用 `scripts/baidu-sitemap.js` 保留原 `baidusitemap.xml` 地址、公开文章 URL 集合和日期字段。
- 保留已通过兼容验证的 `hexo-abbrlink@2.2.1`、`hexo-directory-category@1.1.4`。修正分类 YAML 缩进，显式使用原先实际生效的 `force: false`，保留手工分类。
- 去掉 `hexo-helper-live2d` 与模型 npm 包；将原有 widget 3.1.4、hijiki 模型 1.0.5 的同一份运行资源放入主题 `source/live2dw/`。保留来源、GPL-2.0 许可证和 source map；首页截图确认模型仍正常显示。
- `npm run build` 改为干净构建并执行产物检查。插件加载错误、缺失 CSS、重复文章 URL、损坏的目录锚点、隐藏文章泄露等都会使命令失败，防止旧版“报错但退出码为 0”的问题再次进入发布。
- 修复 3 篇旧 Markdown 的兼容写法：Bootstrap 文章 iframe 后补空行、HTTP 文章 HTML 图片后补空行、3D 案例中两个含空格的图片路径使用标准包裹语法。未更改正文含义、front-matter 或短链接。
- 明确使用 highlight.js；关闭新版 sitemap 默认增加的分类/标签条目。通用 sitemap 保留新版默认首页条目，因此为 **122 篇公开文章 + 首页，共 123 条**；百度 sitemap 仍为 122 条。
- 修复首页缺失 `<title>`，更新主题资源版本；Service Worker 改为清理本博客旧缓存、同源资源联网优先、离线使用当前版本缓存，避免全局 `caches.match()` 命中旧脚本。
- CI 更新 Node/Actions，使用 npm 锁文件缓存、`npm ci`、测试和严格构建。新增 PR 验证，生产仍只向 `server-pages` 分支发布；重写 README，使运行方式与代码一致。

### 已验证

验证机器使用 Node **24.11.1**、npm **11.6.2**；CI 依据 `.nvmrc` 获取 Node 24 系列当前补丁版本。

| 检查 | 结果 |
| --- | --- |
| 按锁文件清空依赖后重新安装 | `npm ci` 成功；第一次仅使用离线缓存时因缓存缺少旧包失败，联网补齐后正常安装 |
| 新版干净构建 | 成功；无插件错误、Sass legacy 警告；生成主题 CSS 和必要静态资源 |
| 文章及页面地址 | 130 篇文章短链接、日期、分类、标签、隐藏标记均与旧版一致；所有 `index.html` 页面路径无增减 |
| 目录锚点 | 全部 631 个文章标题及目录链接与旧版一致；自动检查每个目录目标存在 |
| 图片 | 对照旧版，标准图片及懒加载 `data-src` 引用均保留；中文 URL 百分号编码差异按等价路径比较 |
| 隐藏文章 | 8 篇仍生成独立页面并有 `noindex`；公开列表和两份 sitemap 均未泄露这些文章 |
| sitemap | 原有 122 个公开文章 URL 全部保留；通用 sitemap 仅额外加入首页，百度 sitemap URL 集合不变 |
| 写作回归 | 临时副本中新建文章、自动生成短链接、多级目录分类、保留手工分类、重复构建不改写短链接均通过 |
| 自动化测试 | `npm test` 的 7 项测试全部通过，覆盖写作流程、两种 Sass 语法、百度 sitemap、失败退出及缓存迁移 |
| 浏览器抽查 | Chrome 中确认桌面首页卡片、样式与 Live2D 模型正常显示 |
| 源文件检查 | 仅上述 3 篇文章存在有意的 Markdown 语法调整，没有生成器造成的批量文章改写 |

### 剩余限制与后续事项

- 最终 npm 审计仍报告 **15 项：10 high、5 moderate、0 critical**，不是“零漏洞升级”。移除旧 Live2D 工具链及更新兼容依赖后，已由首次升级安装的 51 项（含 5 critical）下降到该结果。
- 剩余告警主要经 `braces`/`chokidar`/`micromatch`、`sprintf-js` 及旧插件的 `hexo-fs`/front-matter 依赖链传播；当前审计建议部分会把 Hexo 降到 2.x，不能执行 `npm audit fix --force`。相关上游公告包括 [braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)、[sprintf-js](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)。后续应跟进上游补丁，或单独替换旧扩展，而不是声称这些风险已消除。
- jQuery 3.3.1、Bootstrap 3.3.7 等浏览器端静态库仍保留。本次主要升级构建链，没有重写整套前端交互。
- 已完成桌面首页抽查；移动端、全部文章交互、线上 Waline 评论读取/提交、统计服务和真实浏览器旧缓存用户迁移，仍需正式发布前验证。Service Worker 生命周期与离线行为已通过自动化测试，但不等同于完整线上浏览器验收。
- 本次保持主站 `root: /`。备用 `/blog/` 部署仍存在历史硬编码路径，未在本轮升级中统一迁移。
- 工作流已修改但尚未在 GitHub runner 上实际运行，服务器侧发布与回滚也未执行。

升级前完整副本保存在项目内 `tmp/upgrade-baseline/`，另保留原 `public/` 的副本 `tmp/previous-public/`。比较结果和构建日志也在 `tmp/`；该目录不提交到 Git。确认上线与回滚材料已另行保存后，可以清理这些临时文件。

## 1. 结论与建议

**建议升级，目标为 Node.js 24 LTS 的最新安全补丁版本 + Hexo 8.1.2，保留现有 Maupassant 定制主题，分阶段迁移。整体风险中高，主要来自旧插件、渲染器和部署配置。**

升级收益主要是恢复受支持的构建环境、消除 Node Sass 原生二进制依赖、减少陈旧依赖、实现可复现安装，以及获得 Hexo 的维护修复。对已经部署的静态站点而言，Node 升级主要影响构建过程；访问者看到的变化取决于新生成的 HTML、CSS、JavaScript。不能仅凭升级版本承诺页面加载显著提速。

优先级建议：

1. **P0：构建可靠性。** 处理 Node Sass、配置缩进、锁文件和 CI 环境不一致。
2. **P1：迁移正确性。** 升级 Hexo、Pug、Markdown 和生成器；验证短链接、目录分类、隐藏文章、样式及评论。
3. **P2：后续维护。** 整理浏览器端旧库、Live2D 和双部署路径。更换主题或迁移其他博客框架另立任务。

不建议直接执行一次 `npm update` 就发布：现有版本范围不会跨越多数主版本，且“构建退出码为 0”在本项目中不代表产物完整，详见第 3 节。

## 2. 当前状态

| 项目 | 仓库证据与现状 | 对升级的意义 |
| --- | --- | --- |
| Hexo | 根 `package.json` 声明 `^5.4.0`，元数据和已安装版本均为 `5.4.2` | 需要跨越 6、7、8 三个主版本的变化 |
| Node | `.nvmrc` 为 `v14.21.3`；本次终端默认是 `v24.11.1` | 新机器默认环境不能直接可靠构建旧项目 |
| CI | `.github/workflows/pages.yml` 使用 Node `12.x` | 与本地 Node 14 不一致，两者均已结束支持 |
| 安装方式 | CI 执行 `npm install`；本地存在 Yarn v1 `yarn.lock` | npm 不使用 Yarn 锁文件；两种安装结果可能不同 |
| 锁文件 | `.gitignore` 同时忽略 `yarn.lock`、`package-lock.json`；Git 未跟踪两者 | 当前仓库不能单独确定完整依赖树；本地锁文件只能作为评估证据 |
| npm 配置 | `.npmrc` 指向 npmmirror，并配置 `sass_binary_site` | 移除 Node Sass 后应清理其镜像项；当前 npm 已对此配置发出未知配置警告 |
| 主题 | `themes/maupassant` 是项目内的定制副本，无 Git submodule | 不能直接用上游主题覆盖，需保留定制模板和静态资源 |
| 模板/样式 | Pug 模板、`source/css/style.scss`；未发现文章/主题使用 `.ejs`、`.styl`、`.stylus` 文件 | Pug、Sass 是必要渲染链；EJS、Stylus 可评估移除 |
| 文章 | 130 篇 Markdown，全部有 `date`、`abbrlink` 和启用的 `toc`，短链接无缺失、无重复 | 可建立完整 URL 与目录锚点验收基线 |
| 分类 | 130 篇均未填写非空 `categories`/`category`；分类由目录插件推导 | 直接删除目录分类插件会改变分类结构 |
| 隐藏文章 | 8 篇 `hidden: true` | 必须保留生成页面、列表过滤、站点地图过滤和 `noindex` 行为 |
| 图片资源 | 主题 `source/blog_images` 中有 278 个文件 | 替换主题时可能丢失文章图片，不能把主题目录当作可随时重装的纯外观文件 |
| 部署 | 当前工作流由 `master` 推送触发，输出到 `server-pages` 分支 | 工作流名称虽为 Github Pages，实际目标不是 README 示例中的 `gh-pages` |

Node 官方时间表显示：Node 12 于 2022-04-30、Node 14 于 2023-04-30、Node 20 于 2026-04-30 结束支持。Node 24 计划支持到 2028-04-30；Node 22 到 2027-04-30。以本次评估日期，不推荐把 Node 20 作为新升级目标。[1]

## 3. 本次实测及边界

构建仅在临时副本执行，使用项目已有 `node_modules`，未对原项目依赖、配置、文章、`public/` 或 `db.json` 做升级修改。临时评估目录已按要求迁入项目内的 `tmp/`，评估结束后已清理本次创建的副本。

| 验证 | 结果 |
| --- | --- |
| Node 14.21.3 + 当前依赖，清理副本缓存后生成 | 成功；未发现 `ERROR` / `WARN`；`css/style.css` 为 49,774 字节 |
| 文章路由 | 130 个 `/posts/<abbrlink>/index.html` 全部存在 |
| 站点地图 | `sitemap.xml`、`baidusitemap.xml` 各含 122 条 `<loc>`；未发现 8 篇隐藏文章的 URL |
| 隐藏文章页面 | 8 个页面均存在，均检测到 robots `noindex` |
| 将副本切换为当前 Node 24.11.1 | Sass 插件加载失败，日志报告 arm64 / runtime 137 不受 Node Sass 支持；`style.css` 缺失，但退出码仍为 0 |
| 构建对源文章的写入 | 对临时副本构建前后计算文件哈希，未发现文章内容变化 |
| 当前 YAML 解析 | `js-yaml 3.14.1` 将 `auto_dir_categorize` 解析为 `null`，将其下的 `enable`、`force` 解析为根级字段 |

这里验证的是“现有安装能否在本机运行”，**并非从空目录重新安装的验证，也并非 Hexo 8 完整升级成功的验证**。Node 24 检查还同时涉及当前机器架构与旧 Sass 二进制兼容性。

尝试在临时目录安装新版 YAML、Pug、Sass 做进一步编译验证时，工具审批返回拒绝或无法确认批准，未完成安装。因此，本文对新版渲染器的结论是基于官方依赖与源码的兼容性评估；最终主题编译、升级后全量构建、浏览器视觉回归、线上评论与部署均待实施阶段验证。本次未运行完整漏洞审计，不提供未经验证的漏洞数量。

## 4. 建议版本与依赖处理

以下“当前安装”来自本机 `node_modules`，与本地 Yarn 锁文件相符；“官方当前版”来自本次 npm `latest` 查询。版本存在不代表本项目已经通过该组合的兼容测试。[2]

| 依赖 | 当前安装 | 官方当前版 / 建议目标 | 建议与影响 |
| --- | --- | --- | --- |
| `hexo` | 5.4.2 | **8.1.2** | 升级目标；官方 `engines.node` 是 `>=20.19.0`，配合 Node 24 LTS |
| `node-sass` | 5.0.0 | **移除** | 已停止支持；不要升级到最后一个 Node Sass 版本继续使用 |
| `hexo-renderer-sass` | 0.3.2 | **0.5.0** | 新版已依赖 Dart Sass 的 `sass` 包，可优先保留插件名称完成迁移 |
| `hexo-renderer-pug` | 0.0.5 | **3.0.0** | 底层从 Pug `2.0.0-alpha1` 跨到 `^3.0.2`，需编译全部定制模板 |
| `hexo-renderer-marked` | 0.3.2 | **7.0.1** | 底层从 Marked 0.3.x 跨到 15.x；重点检查目录、换行、HTML、图片及代码块 |
| `hexo-generator-index` | 0.2.1 | **4.0.0** | 检查首页排序、每页 8 篇及分页 URL |
| `hexo-generator-archive` | 0.1.5 | **2.0.0** | 检查年月归档、数量及分页 |
| `hexo-generator-category` | 0.1.3 | **2.0.0** | 与目录分类插件联测，检查多级分类 URL |
| `hexo-generator-tag` | 0.2.0 | **2.0.0** | 检查标签数量、路径和隐藏文章过滤 |
| `hexo-generator-sitemap` | 1.2.0 | **3.0.1** | 比较 URL 集合、协议域名、更新时间和隐藏文章过滤 |
| `hexo-generator-baidu-sitemap` | 0.1.9 | 当前仍为 **0.1.9** | 没有新版可解决旧依赖；建议迁移到通用 sitemap 或本地兼容输出方案 |
| `hexo-abbrlink` | 2.2.1 | 当前仍为 **2.2.1** | 首轮保留并锁定，已有文章不重新生成短链接 |
| `hexo-directory-category` | 1.1.4 | 当前仍为 **1.1.4** | 高风险兼容点；先验证，必要时用本地插件替代其目录分类功能 |
| `hexo-hide-posts` | 0.1.1 | **0.4.3** | 升级后必须核验 8 篇隐藏文章，不以能构建作为通过标准 |
| `hexo-helper-live2d` | 3.1.1 | 当前仍为 **3.1.1** | 首轮单独验证；若阻碍升级，考虑将当前效果改为静态资源初始化 |
| `live2d-widget-model-hijiki` | 1.0.5 | 当前仍为 **1.0.5** | 与 Live2D 方案一起处理，注意资源路径 |
| `hexo-server` | 0.3.3 | **3.0.0** | 更新本地预览能力；生产仍是静态文件部署 |
| `hexo-renderer-ejs` | 0.3.1 | 官方 2.0.0；**优先评估移除** | 当前主题为 Pug；百度 sitemap 自带的 `ejs` 依赖不能据此一并认定可删 |
| `hexo-renderer-stylus` | 0.3.3 | 官方 3.0.1；**优先评估移除** | 当前未发现 Stylus 源文件，移除前检查主题依赖声明 |

Sass 迁移有两条可选路径：

- **推荐：`hexo-renderer-sass@0.5.0`。** 官方包依赖已改为 `sass`，保留原插件名称、配置入口，改动较小。其文档仍使用 Sass legacy JS API，可能产生弃用警告，应记录并安排后续处理。[3]
- **备选：`hexo-renderer-dartsass@1.2.0`。** 同样使用 Dart Sass，需要核对配置差异。两个 Sass 渲染插件只保留一个，避免重复注册 `.scss` / `.sass`。

当前 `hexo-renderer-sass@0.3.2` 还在自身依赖树中引入 **`node-sass@4.14.1`**。只删除根级 `node-sass@5.0.0` 无法消除原生构建问题，必须同步升级或替换 Sass 渲染插件。Node Sass 官方已明确要求迁移至 `sass` 或 `sass-embedded`。[4]

## 5. 主要兼容性风险

### 5.1 配置缩进与分类行为：高风险

`_config.yml:85` 起的分类配置使用了 Tab：

```yaml
auto_dir_categorize:
  enable: true
  force: true
```

上面展示的是预期的空格缩进形式，仓库实际使用的是 Tab。当前解析结果导致插件采用默认的 `enable: true, force: false`，而不是配置意图中的 `force: true`。新版 YAML 解析链不应依赖这种非标准缩进；迁移前必须改为空格并验证解析结果。

若首轮以保持当前行为为目标，建议显式设置 `force: false`。目前 130 篇文章没有非空手工分类，改成 `true` 对这批文章未发现直接分类覆盖差异，但会改变今后有手工分类文章的处理规则，应作为明确选择记录。

`hexo-directory-category/lib/processor/post.js` 明确标注其处理器复制自 **Hexo 4.2.1**，并注册文章 processor。它不是简单添加展示字段，而是参与文章入库、日期、分类、标签处理。升级 Hexo 后即使不报错，也需要核对分类关系与文章元数据；如果不兼容，替代实现必须保留目录层级，不能直接删除该功能。

### 5.2 跨主版本的 Hexo 行为：中高风险

| 变化 | 本项目影响与处理 |
| --- | --- |
| Hexo 6 开始读取主题 `package.json` 中的插件依赖 | 清理主题旧依赖声明，见下文；不能只修改根 `package.json` |
| Hexo 7 改为通过 `syntax_highlighter` 选择高亮器 | 显式配置 `syntax_highlighter: highlight.js`，保留现有行号等设置，核对生成 DOM |
| Hexo 7 移除内置 `gist`、`youtube`、`jsfiddle`、`vimeo` 标签 | 本次扫描 130 篇文章未发现这些标签，无需预先添加替代插件；有新增使用时再处理 |
| Hexo 7 移除旧的布尔 `external_link`、`use_date_for_updated`、文章 `link` 属性等用法 | 本项目 `external_link` 已是对象；未发现文章 front-matter `link`，不是当前主要阻塞点 |
| Hexo 8 提高 Node 要求、调整文章集合和代码块等内部处理 | 重点回归使用文章集合、私有方法或旧 processor 的插件 |

这些变化来自 Hexo 6、7、8 官方发布说明；可以直接以 8.1.2 为最终目标，遇到问题时用 6/7 作为定位兼容性变化的中间验证点，不要求每个主版本都上线一次。[5][6][7]

`themes/maupassant/package.json` 仍包含 Hexo 3 时代的依赖清单。它不表示当前站点实际运行 Hexo 3，但在 Hexo 6+ 中不再只是完全无影响的历史文件。Hexo 8 插件加载源码会合并主题与根目录插件列表，同名插件以根目录为准；主题中独有且可解析的插件仍可能被发现。[8]

建议将其整理为真正的主题元数据，仅保留有意管理的主题依赖，避免根目录移除了某个渲染器，主题仍声明该插件。不要到主题目录再安装一套 Hexo 3 依赖。

### 5.3 主题、Markdown 与样式：高风险

该主题已包含定制导航、文章卡片、打赏、Waline、图片全屏、代码块宽度调整和 Service Worker。整体替换主题会同时改变外观、交互及资源路径，首轮应保留。

- **Pug：** 完整编译 `layout/` 下所有模板，检查 include / extends、属性语法、转义及 Hexo helper 调用。Pug alpha 跨到 3.x 的兼容性尚未实测，不能保证零修改。
- **Sass：** 生成 `style.css` 后对比桌面/移动端布局、颜色、字体和代码高亮。Dart Sass 与 LibSass 存在语法、输出及 API 差异；当前样式以单个 SCSS 文件为主，迁移范围相对集中。
- **Markdown：** 当前 Marked 0.3.x 非常旧，升级后重点比较中文/重复标题的锚点、嵌套列表、换行、表格、代码围栏和图片路径。全部 130 篇均启用了目录，标题 ID 变化会影响目录跳转和带 `#锚点` 的历史链接。
- **嵌入内容：** 文本扫描在 62 篇文件中发现 HTML 标签文本，其中包括代码示例；不能据此认定全部是运行中的脚本。确有文章直接引入 `/js/echarts.min.js`，需抽样验证图表及 HTML 内容。不要在同一轮无差别打开 HTML 清洗，避免破坏现有标签或演示内容。[9]
- **高亮 DOM：** `codeblock-resizer.js` 直接依赖 `figure.highlight`、`.gutter`、`.code`。若切换 Prism 或改变高亮结构，代码块宽度逻辑可能失效，首轮保持 highlight.js。

`_partial/head.pug` 引入的 jQuery 3.3.1、Bootstrap 3.3.7、LazyLoad 等是仓库中的静态文件，**更新 npm 依赖不会更新它们**。这些库需要独立维护；直接跨到 Bootstrap 5 会要求重写导航结构、属性及交互，不宜混入本次基础升级。

### 5.4 短链接、SEO、隐藏文章和评论：高风险

**短链接保持不变是发布前提。** 当前配置为 `posts/:abbrlink/`、CRC16、十进制。130 篇均已有唯一 `abbrlink`，应原样保留。不要修改 permalink 模板、强制重新计算 abbrlink，或用文章标题重新生成路径。

`hexo-abbrlink` 源码会在缺少短链接等条件下写回文章；实施时须比较 `source/` 的 Git diff，并测试新文章生成短链接的行为。旧文章不应因构建被批量重写。

`hexo-hide-posts@0.1.1` 使用 `_bindLocals()` 等内部机制并包装生成器。升级必须同时验证：首页、归档、分类、标签及 sitemap 不列出 8 篇隐藏文章；它们的独立页面继续生成并带 `noindex`。隐藏文章仍可通过 URL 访问，这一插件的作用不是访问鉴权。

`hexo-generator-baidu-sitemap@0.1.9` 直接依赖 `hexo: ^3.0.0`，当前依赖树因此额外带入 Hexo 3.9.0 及其旧依赖。这是依赖体积与维护负担的实际来源，并不表示主站由 Hexo 3 运行。建议确认现有百度提交入口后，改用通用 `sitemap.xml`，或保留同路径的 `baidusitemap.xml` 兼容输出；删除插件前先确定替代产物及内容要求。

Waline 在 `_partial/comments.pug` 中使用固定服务地址，且没有显式设置 `path`。因此迁移时应核对客户端实际使用的页面路径，保持旧 URL、尾斜杠与评论路径对应关系；若同时调整 `/blog/` 部署前缀，旧评论可能看起来“丢失”。本次没有访问或迁移评论服务数据，不能认定线上评论已验证。

### 5.5 域名、子路径和浏览器缓存：中高风险

当前主站配置是 `https://www.scaugreen.cn`、`root: /`；README 还描述了 `/blog/` 的备用部署。模板与脚本存在多处根绝对路径，例如导航 `/posts/...`、Waline `/js/waline3.8.js`、注册脚本 `/sw-init.js` 和 Service Worker `/sw.js`。仅修改 Hexo 的 `root` 不能修复所有这些引用。

新版 Markdown renderer 还支持默认开启的 `prependRoot` 图片路径处理。对曾经手工加过 `/blog/` 前缀的内容，须验证最终路径，防止重复前缀或遗漏；原始 HTML、模板和 JavaScript 中的路径仍需单独检查。[9]

首轮建议保持主站域名、`root` 与发布分支。若还要维护备用站，后续使用部署专用配置覆盖文件，并将模板/脚本改为感知站点根路径，分别验证 `/` 和 `/blog/`，不要继续依赖人工批量替换。

现有 `sw.js` 使用固定缓存名 `my-site-cache-2021-02-14`，对部分图片、JSON、`min.js` 等资源采用缓存优先，未看到旧缓存清理逻辑。它通过全局 `caches.match()` 查找资源，**只修改缓存名称仍可能命中旧缓存**。

因此更新同名浏览器脚本或 Live2D 资源时，要同步设计缓存迁移：清理旧缓存、限定查找范围或使用资源版本化，并验证已有 Service Worker 用户与首次访问用户。当前规则并非缓存所有 CSS/HTML，不能把所有页面更新问题都归因于它。

## 6. 构建与部署调整

1. **统一 Node。** `.nvmrc`、`package.json` 的 `engines`、CI 和 README 使用同一 Node 24 LTS 基线，并记录具体补丁版本。当前机器上的 24.11.1 只是本次测试环境，不代表应锁定为未来生产版本。Node 22 最新补丁可作为短期兼容备选。
2. **统一使用 npm 并提交 `package-lock.json`。** 与当前 CI 保持一致；从 `.gitignore` 移除该锁文件的忽略项。不要同时维护 npm 与 Yarn 两套安装流程。首次解析后检查依赖树，再提交锁文件；之后 CI 使用 `npm ci`。
3. **重做缓存。** 取消仅以 `${runner.OS}` 为键缓存 `node_modules` 的做法；优先使用 `setup-node` 的 npm 下载缓存和锁文件指纹。旧缓存既不能保证版本正确，也可能混入不同 Node ABI 的二进制产物。
4. **更新 Actions。** 本次官方查询为 `actions/checkout@v7.0.1`、`actions/setup-node@v7.0.0`、`peaceiris/actions-gh-pages@v4.1.0`。实施时复核 runner 最低要求并固定审核后的版本或提交 SHA。更新 Action 自身运行时和设置项目 Node 版本是两件事，都需要处理。[10]
5. **保留发布语义。** 首轮仍由 `master` 触发，输出到 `server-pages`；核对 `contents: write` 权限以支持分支推送。仓库中未包含服务端消费该分支的完整配置，不能假定修改分支名无影响。
6. **先验收后部署。** 增加只构建/预览的验证流程，通过后再进入生产发布。除了退出码，检查 `Plugin load failed`、`ERROR`、主样式是否存在且非空、文章路由与 sitemap 是否完整。
7. **同步文档。** README 中 Node 12 的 Action 示例、全局安装 Hexo 的方式、备用站说明需与最终实现一致；日常优先使用项目内 `npm run build` / `npm run dev`。

移除 Node Sass 后清理 `.npmrc` 的 `sass_binary_site`。npm 注册表是否继续用镜像可按实际网络保留，但应固定同一安装策略并验证锁文件引用的包可下载。

## 7. 实施顺序与工作量

以下为单人、熟悉 JavaScript/Hexo 的有效工作日估算，包含验证与修复，不含等待线上部署窗口；并非已经完成的升级工作。

| 阶段 | 主要工作与完成条件 | 估算 |
| --- | --- | --- |
| A：保全基线 | 在独立升级分支保存依赖清单、静态产物、文章 URL/分类清单；所有临时文件放项目 `tmp/`，不提交临时产物 | 0.5 天 |
| B：构建链迁移 | 清理配置缩进、主题依赖元数据；升级 Sass/Pug/Markdown；去掉两条 Node Sass 依赖链，统一 Node 与锁文件 | 1–2 天 |
| C：Hexo 与插件 | 升级到 8.1.2 和对应生成器；处理目录分类、隐藏文章、百度 sitemap、Live2D；完成全量生成 | 1–2 天 |
| D：验收与部署 | 做 URL/分类/隐藏规则比较、视觉与评论验证、缓存迁移、CI 更新、发布与回滚演练 | 1–2 天 |

**预计合计 3.5–6.5 个工作日。** 如果目录分类插件需要重写、同时恢复 `/blog/` 备用部署或更新整套前端库，另预留 2–4 天。文章只有 130 篇，内容规模可控；主要不确定性是主题与旧插件的耦合。

可先做 B/C 阶段的独立验证版本，再决定是否同步整理 Live2D 和前端旧库。所有依赖变更都应在独立分支或项目内隔离副本中实施，不覆盖当前可用产物。

## 8. 发布前验收清单

- [ ] 新环境从空依赖目录执行 `npm ci` 成功，不依赖机器预装的全局 Hexo、旧 `node_modules` 或 Node Sass 二进制。
- [ ] 依赖树不再包含 `node-sass`；移除百度旧插件后，确认其额外引入的 Hexo 3 依赖链消失。
- [ ] YAML 解析后的分类配置正确；主题依赖声明与根目录策略一致。
- [ ] 从干净 `db.json` / `public/` 状态生成成功，日志无未处理的插件加载失败；CSS/JS 及首页、文章页非空。
- [ ] 当前 130 个文章 URL 全部保持，`abbrlink` 不变、无重复；新文章短链接生成测试在副本完成。
- [ ] 当前 122 篇公开文章与 8 篇隐藏文章的页面生成、列表可见性、两份 sitemap 及 `noindex` 行为符合基线。
- [ ] 对比所有分类/标签/归档 URL、文章归属、排序与分页；首页每页 8 篇，其他分页保留当前配置。
- [ ] 对比文章时间、归档月份、sitemap 更新时间。当前 `timezone` 为空且文章未显式填写 `updated`，干净检出与构建时区可能改变日期展示或 `lastmod`，需明确最终策略。
- [ ] 抽样检查中文标题锚点、目录跳转、嵌套列表、代码块行号及横向滚动、表格、HTML/ECharts 演示、图片和打赏。
- [ ] 桌面与手机验证导航展开、文章卡片、图片全屏、懒加载、Live2D；浏览器无新增资源 404 或脚本错误。
- [ ] 抽样确认已有 Waline 评论与计数归属未变；验证百度统计和不蒜子仍正常加载。
- [ ] 首次访问及已安装旧 Service Worker 的访问都能获取新版资源，缓存迁移验证通过。
- [ ] 如发布备用站，单独通过 `/blog/` 下的图片、脚本、导航、评论及 Service Worker 测试。
- [ ] 确认部署分支仍为预期目标；保留上一版生产静态产物和对应源码、锁文件，完成回滚演练。

当前 Node 14 基线证明旧站可以生成，但尚未验证线上视觉与所有外部服务行为；实施时应先记录这些基线，再做升级对比。

## 9. 回滚方案

发布前保存上一版静态产物、源码提交和依赖锁文件，记录 `server-pages` 的生产提交。预览验证通过后再发布新产物；必要时重新部署上一版静态文件恢复访问，无需等待旧 Node 环境重新安装成功。

同时保留升级前的文章 front-matter 和 URL 清单，避免插件写回造成不可追踪的链接变化。`db.json` 是构建缓存，切换版本时重新生成，不作为内容迁移依据。回滚后仍要验证 Service Worker 缓存，服务器静态文件恢复不一定会立即替换客户端已缓存的脚本。

## 10. 资料来源

版本与支持周期核对日期均为 2026-10-08，后续实施时需重新查询。

1. [Node.js 官方发布周期](https://github.com/nodejs/Release/blob/main/schedule.json)。
2. [Hexo 官方 npm 元数据](https://registry.npmjs.org/hexo/latest)。依赖表中的各包均查询了官方注册表 `https://registry.npmjs.org/<包名>/latest`；[Pug renderer](https://registry.npmjs.org/hexo-renderer-pug/latest)、[Marked renderer](https://registry.npmjs.org/hexo-renderer-marked/latest)、[百度 sitemap](https://registry.npmjs.org/hexo-generator-baidu-sitemap/latest) 为重点核查项。
3. [hexo-renderer-sass 官方包元数据](https://registry.npmjs.org/hexo-renderer-sass/latest)、[配置与 Dart Sass 说明](https://github.com/knksmith57/hexo-renderer-sass)、[hexo-renderer-dartsass 元数据](https://registry.npmjs.org/hexo-renderer-dartsass/latest)。
4. [Node Sass 官方 npm 弃用声明](https://registry.npmjs.org/node-sass/latest)。
5. [Hexo 6.0.0 发布说明](https://github.com/hexojs/hexo/releases/tag/6.0.0)。
6. [Hexo 7.0.0 迁移指南与发布说明](https://github.com/hexojs/hexo/releases/tag/v7.0.0)。
7. [Hexo 8.0.0 发布说明](https://github.com/hexojs/hexo/releases/tag/v8.0.0)、[8.1.2 发布说明](https://github.com/hexojs/hexo/releases/tag/v8.1.2)。
8. [Hexo 8.1.2 插件加载源码](https://github.com/hexojs/hexo/blob/v8.1.2/lib/hexo/load_plugins.ts)。
9. [hexo-renderer-marked 官方配置说明](https://github.com/hexojs/hexo-renderer-marked)。
10. [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)、[setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0)、[actions-gh-pages v4.1.0](https://github.com/peaceiris/actions-gh-pages/releases/tag/v4.1.0)。

本地主要证据：[根依赖清单](package.json)、[站点配置](_config.yml)、[Node 版本](.nvmrc)、[npm 配置](.npmrc)、[Git 忽略配置](.gitignore)、[CI 配置](.github/workflows/pages.yml)、[主题依赖清单](themes/maupassant/package.json)、[主题配置](themes/maupassant/_config.yml)、[主题模板](themes/maupassant/layout/)、[浏览器缓存脚本](themes/maupassant/source/sw.js)。
