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
&emsp;这里展示一些常用操作但基础教程视频里又没有提到的技巧。若还没学习基本操作，请看视频：
- [blender 2.8 官方 基础视频教程 （youtube 英文）](https://www.youtube.com/watch?v=MF1qEhBSfq4&list=PLa1F2ddGya_-UvuAqHAksYnB0qL9yWDO6&index=2&t=0s)
- [blender 2.8 官方 基础视频教程 （有网友添加了中文字幕并放到了B站）](https://www.bilibili.com/video/BV1nt411J7SE?p=1)

&emsp;主要操作与快捷键包括：
- 移动(`g`)、缩放(`s`)、旋转(`r`)物体的操作，及操作时指定方向（`x`,`y`,`z`）
- 设置材质
- Edit Mode 与 object Mode 的模式切换(`Tab`)，Edit Mode 下选择并编辑点线面
- 设置物体的parent关系。（`Shift + 拖动物体`）
- UV贴图
- `e` extredu 拉伸能拉出新平面

### 没提到但很常用的快捷键
- `F9`能调出 上次动作的参数调整面板，用于调整参数。
- `/`(Slash)斜杠，切换全局视野/当地视野，当地视野能隐藏其它物体，十分方便。


### 设置支持中文路径
&emsp;blender在显示中文路径上会出现问题，如下设置：
![blender设置支持中文文件名](/blog_images/3d/blender设置支持中文文件名.png)

### 顶点融合
&emsp;通过各种方式创建的复杂物体，极有可能出现重复的点(比如说两个顶点都是位于(1,2,3)，那么可以优化成一个顶点。)，优化方法为：进入编辑模式，全选点，然后mesh->clean up -> merge by distance,自动将近距离的点融合，左下角可调整融合距离。对于复杂的模型来说，顶点融合能优化不少顶点，减少数据量。
![顶点融合](/blog_images/3d/顶点融合.png)

&emsp;对于想手动融合某些顶点，可以在active tool and workspace setting 里 进入edit mode里人可选 autoMerge,靠近的两点能自动融合。  再配合上面的吸附，勾选对点吸附，就能达到融合操作。
![顶点融合2](/blog_images/3d/顶点融合2.png)

- 参考视频[顶点融合-YouTube](https://www.youtube.com/watch?v=S4lAxqfG96o)

### 复制实例
&emsp;`shift + d` 代表duplicate object，能复制对象出来，然后`shift + r`能够重复 复制操作，很方便。特别地，`alt + d`代表 duplicate linked，复制实例(instance) ,它们共享geometry数据，大大减少数据量。geometry如果越少，在three.js渲染计算量就越少，使用instanceBufferGeometry也能生成实例。

### 绘制曲线并转换成Mesh
&emsp;`shift+a -> Curve -> Bezier`添加曲线，若节点不够，按`e`添加新节点。参数设置的`Resolution Preview U`决定横向环数。`Bevel`中的`Depth`决定大小，`Resolution`决定每环的点数。

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com//3D/blender%E5%88%B6%E4%BD%9C%E6%9B%B2%E7%BA%BF%E5%8F%98Mesh.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

### 分离/隔离 物体
&emsp;`split` 能将相互关联的顶点分离开来，修改不会影响到关联的顶点同时变化。`separate` 能将把选中的物体隔离出来，形成另一个Mesh。
![blender分离与隔离](/blog_images/3d/blender分离与隔离.JPG)

### 导出透明效果
&emsp;经测试blender 2.82版本并不能导出 alpha map图像（我估计以后的版本会修复这种问题），注意透明效果需要设置使用cycles引擎或材质里设置 setting - Blend Mode 修改成 Alpha ...才能在blender渲染出来。three.js里的opacity对应颜色的透明度：
![导出透明度](/blog_images/3d/导出透明度.png)

### 其它组的模型充当子模型会变成连接
&emsp;blender可以按住`Shift`键拖动模型去其它模型下，充当其子模型。特别地，若这个模型是在其它组(collection)，拖动到其它组充当子模型时，是以连接形式（link，灰色字体）存在。若不想以link的形式，则必须把先把模型拉到同一个组里。
![blender其它组link过去](/blog_images/3d/blender其它组link过去.png)

### 修改不动点
&emsp;先用3D cursor设置想要的不动点位置（可以n 调出参数面板，view 里使用参数来修改 3D cursor 坐标）。
&emsp;然后 object mode 下， 选择Object -> set origin -> origin to 3D cursor。
&emsp;在[7-开关门(不动点)](/posts/48386)，有详细的操作视频。

- [Blender 2.8-如何更改枢轴点 - YouTube](https://www.youtube.com/watch?v=RGrXpBB_ekk)