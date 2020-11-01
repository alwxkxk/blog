---
title: 数据中心
toc: true
abbrlink: 19890
date: 2020-11-01 21:06:00
donate: true
tags:
- three.js
- 3D
---

## 示例效果
&emsp;这是3D可视化教程系列的文章，如果第一次阅读请先阅读[《3D可视化教程导读》](/posts/30679)，这里展示简单的数据中心3D可视化，界面是响应式的（即可以缩放大小基本保持一致），可访问[c-datacenter 展示网址](http://3d.scaugreen.cn/c-datacenter.html)：
<img alt="数据中心" src="/blog_images/3d/c-数据中心.gif">

## 源码及3D项目文件
&emsp; 源码及工程项目都放到github上。
&emsp; 源码：[threejs-example](https://github.com/alwxkxk/threejs-example)。
&emsp; Blender工程项目：[threejs-example-blender-project](https://github.com/alwxkxk/threejs-example-blender-project)。


## 原理
&emsp;当3D界面不再是占用整个浏览器时，其坐标的计算公式略有不同，在three.js的官方例子里并没有，所以这里给出了简单的例子，详细请看[6-屏幕坐标换算](/posts/56155)。
&emsp;机柜门的开关动作，需要修改其中心点，从模型中心移到门轴中心，才能实现这样的沿轴旋转，详细请看[7-开关门-不动点](/posts/48386)。
&emsp;双击让摄像头聚焦物体，详细请看[8-聚焦靠近](/posts/30581)。

&emsp;浏览器的响应式设计，比较简单，利用CSS中`vh`与`vw`便可实现动态计算浏览器界面的高宽，我利用PS制作了一张背景图是4：3比例的，所以按以下CSS代码即可实现响应式缩放。


<img alt="board" src="/blog_images/3d/board.png">
```css
width: 20vw;
height: 15vw;
background-image: url('/static/img//board.png');
background-repeat: no-repeat;
background-size: cover;
```

&emsp;three.js中缩放则需要重新设置render与camera：
```js
camera.aspect = clientWidth / clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(clientWidth, clientHeight);
```

