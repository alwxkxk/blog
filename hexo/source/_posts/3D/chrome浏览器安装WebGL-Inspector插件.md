---
title: chrome浏览器安装WebGL-Inspector插件
toc: true
tags:
  - chrome
  - WebGL
  - 3D
abbrlink: 57656
date: 2019-01-07 17:36:22
---

&emsp;折腾了一天`WebGL-Inspector`，怎么搞都不行。上google应用商城找，又找不到。没想到chrome插件网竟然还有，亲测有效。
&emsp;[WebGL-Inspector CRX文件-百度网盘](https://pan.baidu.com/s/1US-z_rp0c3FKhckIYEAVtQ)
&emsp;在chrome中新开一个TAB，输入：`chrome://extensions/` 回车，然后把CRX文件拖进去，就能安装完毕。
![](/blog_images/005BIQVbgy1fyy5zn2zfrj31hc0u0199.jpg)

&emsp;最近发现安装时会提示安装失败：`程序包无效:"CRX_HEADER_INVALID"`，网上的解决办法是改后缀名为`.rar`，手动解压后，选择`加载已解压的扩展程序`，具体可看[解决Chrome插件安装时程序包无效:"CRX_HEADER_INVALID"](https://blog.csdn.net/wst0717/article/details/88867047)。

## 附录
[chrome插件网](http://www.cnplugins.com/)
[Chrome插件离线安装，CRX格式安装方法](http://www.cnplugins.com/tools/how-to-setup-crx.html)
[github WebGL-Inspector](https://github.com/benvanik/WebGL-Inspector)