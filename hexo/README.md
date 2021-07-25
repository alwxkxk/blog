# README
个人博客（基于hexo）
```bash
npm install hexo -g
npm install -g hexo-cli
npm install
hexo new 新文章标题
hexo generate // hexo V4.2.1 以上才兼容nodeV14，否则生成空白文件。

# 运行
hexo s
```

修改领航栏：
hexo\themes\maupassant\layout\_widget\navbar.pug

## 启动
`hexo s -p 3000`

## gh-page
[gh-pages](https://alwxkxk.github.io/blog/posts/23630/)


[gh-pages-dev](https://github.com/alwxkxk/blog/tree/gh-pages-dev)是专门针对部署到`gh-pages`所用的分支，需要手动修改的地方很多，修改处为：
- `hexo\_config.yml`里的配置路径修改成： `root: /blog/` ，在master分支里是`/`
- `hexo\themes\maupassant\layout\_widget\navbar.pug` 里的路径路径修改成`/blog/posts/38208`，在master分支里是`/posts/38208`
- 图片路径全部从`/blog_images/xxx.jpg` 修改成`https://media.githubusercontent.com/media/alwxkxk/blog/gh-pages/blog_images/xxx.jpg`


建议准备两个目录，从master 增量地添加到 gh-pages-dev，这样子处理比两分支merge更方便，提交后自动由action部署。

