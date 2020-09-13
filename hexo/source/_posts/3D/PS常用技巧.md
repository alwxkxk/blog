---
title: PS常用技巧
toc: true
tags:
  - photoshop
abbrlink: 27566
date: 2020-06-05 20:04:02
---

&emsp; 做3D贴图时，时常需要利用PS来调整图片：

## 技巧

### 调整图像大小
&emsp; webGL1需要调整图片为POW大小（Power Of Two），即像素大小符合2的倍数（`32*32,64*64,128*128,...,1024*1024,...`）以获取更好的性能。
&emsp;做法：1.创建时就指定像素。2.菜单栏：图像->图像大小。
<img alt="POT" src="/blog_images/3d/photoshop-POT.png" style="width:50%;">
<img alt="POT" src="/blog_images/3d/photoshop-POT2.png" style="width:50%;">

### 钢笔工具练习
&emsp; 大家可以通过[The Bezier Game](https://bezier.method.ac/)这个在线学习网站学习练习一下，PS的钢笔工具。

### 缩放图层
&emsp;复制过来的图层经常会出现图像太大的情况，所以要缩小图层。做法：选中图层后，按`Ctrl+T`，再用鼠标在其边界拖拉缩放。
&emsp;注意这是破坏性编辑。比如，你把一个图缩小了，确定，再放大回来，就会发现很多锯齿。而智能对象就不会。每次自由变换，都会根据对象的原始数据重新进行缩放。所以每次缩放图层前，建议先把图层转换为智能对象。

### 图层颜色
&emsp;选好图层、选好颜色，按`Alt+Delete`，就会使图层变颜色。

### 添加杂色以增加真实感
&emsp;先将图层变成指定的颜色`alt+delete`，然后选择菜单栏：滤镜-杂色-添加杂色。
- [PS教程！手把手教你绘制一个金属质感的进度条 \| 优设网 - UISDC](https://www.uisdc.com/photoshop-iron-progress-bar)

### 减淡加深工具
&emsp;拍照实物时因光线、拍摄等问题，可能导致有明暗效果，这样去贴图在3D展示效果并不好，这时就需要减淡加深工具来调整，结合光照/对比度调整达到最好的效果：
<img alt="PS减淡加深工具" src="/blog_images/3d/PS减淡加深工具.png" style="width:200px;">

### 添加参考线
&emsp;设计时参考线有利于定位，特别是做动态图而制作的雪碧图，参考线就特别重要。菜单栏：视图->新建参考线。也可以显示标尺后，直接使用鼠标有标尺那里拉出来。


