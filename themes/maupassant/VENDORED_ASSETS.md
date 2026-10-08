# Live2D 静态资源

`source/live2dw/` 保留升级前站点使用的同一份浏览器资源与路径：

- Widget：[`live2d-widget@3.1.4`](https://github.com/xiazeyu/live2d-widget.js)，GPL-2.0。
- 模型：[`live2d-widget-model-hijiki@1.0.5`](https://github.com/xiazeyu/live2d-widget-models)，包声明许可证为 GPL-2.0。
- 许可证保存在 `source/live2dw/LICENSE`，JavaScript source map 随资源保留。

这些文件来自升级前实际生成的 `public/live2dw/`，没有修改模型或浏览器运行库。初始化位于 `layout/_partial/after_footer.pug`，由站点配置 `live2d.enable` 控制。

这样保留原有显示效果，同时移除 `hexo-helper-live2d`、`opencollective`、`npm-check-updates` 等不再需要的构建依赖。以后更新此目录时需同步验证模型加载，并更新 Service Worker 缓存版本。
