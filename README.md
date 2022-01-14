# README
生子当如哈士奇的个人博客，包含若干技术文章，以及《软硬结合——从零打造物联网》、《3D可视化教程》两个系列教程。

## 运行
```bash
npm install hexo -g
npm install -g hexo-cli
npm install
hexo new 新文章标题
hexo generate // hexo V4.2.1 以上才兼容nodeV14，否则生成空白文件。

# 运行
hexo server
# 打包
hexo build
```

## gh-page
[gh-pages](https://alwxkxk.github.io/blog/posts/23630/)


[gh-pages-dev](https://github.com/alwxkxk/blog/tree/gh-pages-dev)是专门针对部署到`gh-pages`所用的分支，需要手动修改的地方很多，修改处为：
- `hexo\_config.yml`里的配置路径修改成： `root: /blog/` ，在master分支里是`/`
- `hexo\themes\maupassant\layout\_widget\navbar.pug` 里的路径路径修改成`/blog/posts/38208`，在master分支里是`/posts/38208`
- 图片路径全部从`/blog_images/xxx.jpg` 修改成`https://media.githubusercontent.com/media/alwxkxk/blog/gh-pages/blog_images/xxx.jpg`


准备两个目录，从master 增量地添加到 gh-pages-dev，这样子处理比两分支merge更方便，提交后自动由action部署。

action workflows pages.yml:
```
name: Pages

on:
  push:
    branches:
      - gh-pages-dev  # default branch

jobs:
  pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: Cache NPM dependencies
        uses: actions/cache@v2
        with:
          path: hexo/node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        working-directory: hexo
        run: npm install
      - name: Build
        working-directory: hexo
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./hexo/public
          publish_branch: gh-pages  # deploying branch

```


## 修改
hexo 模板来源于[maupassant-hexo](https://github.com/tufu9441/maupassant-hexo)。

修改领航栏：
hexo\themes\maupassant\layout\_widget\navbar.pug

