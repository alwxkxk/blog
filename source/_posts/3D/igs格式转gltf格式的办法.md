---
title: igs格式转gltf格式的办法
toc: true
abbrlink: 16484
date: 2022-05-12 14:46:05
tags:
---


&emsp;最近由于工作原因需要研究igs格式转gltf格式，经测试发现免费软件中[FreeCAD](https://www.freecadweb.org/)可以做到：


![igs2gltf_1](/blog_images/3d/igs2gltf_1.webp)
![igs2gltf_2](/blog_images/3d/igs2gltf_2.webp)

&emsp;使用时需要注意，如果你window的用户名是中文的名，会导致打开程序闪退，这时需要新建一个英文名称的帐号登陆再运行即可。相关BUG我也在对应的issue里提出：[Non-ASCII usernames in MediaWiki not working](https://github.com/FreeCAD/FreeCAD/issues/6041)。


&emsp;我这边需要转换的igs文件是CATIA工程导出的，用FreeCAD打开时发现颜色都丢失了，估计是不同软件之间的转换导致的丢失，暂时没深入研究。

## 其它参考
- [3d-model-convert-to-gltf](https://github.com/wangerzi/3d-model-convert-to-gltf)
