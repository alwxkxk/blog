---
title: nvm安装node14异常
toc: true
abbrlink: 42520
date: 2025-01-29 01:46:04
tags:
---
window下nvm 安装node14时，会出现异常，无法安装对应版本的npm：

```
Please visit https://github.com/npm/cli/releases/tag/v6.14.17 to download npm.
```
一种解决办法是自行下载安装，另一种最简单的解决办法是回滚到1.1.12（因为发现这是1.2版本之后引进的BUG），安装包如下：

通过网盘分享的文件：nvm-setup_1.1.12.exe
链接: https://pan.baidu.com/s/1z7DmsA9p-oCieHgSFWgocw?pwd=t9wr 提取码: t9wr


## 附录
- [stackoverflow-NVM installation error on Windows. Cannot find the npm file](https://stackoverflow.com/questions/79339258/nvm-installation-error-on-windows-cannot-find-the-npm-file)
- [github-issues-NVM for Windows cannot install npm 6.14.17](https://github.com/npm/cli/issues/4890)
