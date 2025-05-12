---
title: blender修改empty物体的原点
toc: true
abbrlink: 8177
date: 2025-05-12 10:10:15
tags:
---

&emsp;一般物体修改origin的方法,是点击左上方的object进行调整：
<img alt="blender修改origin方法" src="/blog_images/3d/blender修改origin方法.webp">
&emsp;在使用别人提供的模型的时候发现，模型的原点与模型物体不一致，使用传统的办法修改原点(set origin似乎对empty 的原点不生效)。网上搜索，的解决办法也不是很好，最终尝试时发现，可设置右上角options，勾选parent后，就可以选中原点，再按`G`进行移动，人工调整移动到模型中心,调整完再取消勾选即可（不可使用transform面板修改数据）：
<img alt="blender修改parents" src="/blog_images/3d/blender修改parents.webp">
