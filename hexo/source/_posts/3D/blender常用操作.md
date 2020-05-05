---
title: blender常用操作
toc: true
tags:
  - 3D
  - blender
abbrlink: 46886
date: 2020-05-05 09:17:45
---

## blender常用操作
&emsp;这里展示一些常用操作但基础教程视频里又没有提到的技巧。

### 顶点融合

&emsp;通过各种方式创建的复杂物体，极有可能出现重复的点(比如说两个顶点都是位于(1,2,3)，那么可以优化成一个顶点。)，优化方法为：进入编辑模式，全选点，然后mesh->clean up -> merge by distance,自动将近距离的点融合，左下角可调整融合距离。对于复杂的模型来说，顶点融合能优化不少顶点，减少数据量。
![顶点融合](/blog_images/3d/顶点融合.png)

&emsp;对于想手动融合某些顶点，可以在active tool and workspace setting 里 进入edit mode里人可选 autoMerge,靠近的两点能自动融合。  再配合上面的吸附，勾选对点吸附，就能达到融合操作。
![顶点融合2](/blog_images/3d/顶点融合2.png)

- 参考视频[顶点融合-YouTube](https://www.youtube.com/watch?v=S4lAxqfG96o)

### 复制实例
&emsp;`shift + d` 代表duplicate object，能复制对象出来，然后`shift + r`能够重复 复制操作，很方便。特别地，`alt + d`代表 duplicate linked，复制实例(instance) ,它们共享geometry数据，大大减少数据量。geometry如果越少，在three.js渲染计算量就越少，使用instanceBufferGeometry也能生成实例。


### 分离/隔离 物体
&emsp;`split` 能将相互关联的顶点分离开来，修改不会影响到关联的顶点同时变化。`separate` 能将把选中的物体隔离出来，形成另一个Mesh。
![blender分离与隔离](/blog_images/3d/blender分离与隔离.JPG)

### 导出透明效果
&emsp;经测试blender 2.82版本并不能导出 alpha map图像（我估计以后的版本会修复这种问题），发现了另一种做法可以导出透明效果：使用 transparent BSDF 拉到Mix Shader 进行混合，Mix Shader 的Fac 使用 Add 来修改比例即可，最终会得到 在three.js opacity的调整值。可以参考这个模型的材质设置：
[Pc Gaming Ryzen Nvidia 1660 - Sketchfab](https://sketchfab.com/3d-models/pc-gaming-ryzen-nvidia-1660-a8477b1bcafa46ffb66af25e287fd098)

### 其它组的模型充当子模型会变成连接
&emsp;blender可以按住`Shift`键拖动模型去其它模型下，充当其子模型。特别地，若这个模型是在其它组(collection)，拖动到其它组充当子模型时，是以连接形式（link，灰色字体）存在。若不想以link的形式，则必须把先把模型拉到同一个组里。
![blender其它组link过去](/blog_images/3d/blender其它组link过去.png)