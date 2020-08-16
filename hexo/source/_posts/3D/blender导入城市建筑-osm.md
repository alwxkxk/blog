---
title: blender导入城市建筑(.osm)
toc: true
abbrlink: 20949
date: 2020-05-23 15:45:29
tags:
- blender
- 3D
---

&emsp;在做3D可视化时，有时需要一堆建筑来衬托，现在演示一下如何导入城市建筑，操作视频如下：
![导入osm效果](/blog_images/3d/导入osm效果.png)

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/3D/blender%E5%AF%BC%E5%85%A5osm%E6%96%87%E4%BB%B6.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

## 下载osm文件
&emsp;先在openstreetmap里导出得到osm文件，[导出 \| OpenStreetMap](https://www.openstreetmap.org/export#map=15/23.1181/113.3204)。
&emsp;我做演示时所用到的[map.osm-百度网盘](https://pan.baidu.com/s/14PIDrDT08FKDLHxhn1nKfg ),提取码：`vw6u`。建议自行生成下载尝试。
![openStreepMap下载osm](/blog_images/3d/openStreepMap下载osm.png)

## 安装blender-osm插件
&emsp;安装blender-osm 免费版：[GitHub blender-osm](https://github.com/vvoovv/blender-osm)（免费版要下载时可以选择捐零元）。（C4D类似的插件只有付费版，所以部分C4D用户会选择先通过blender导入，再导出模型到C4D继续编辑。）
&emsp;我做演示时所用到的[blender-osm.zip-百度网盘](https://pan.baidu.com/s/1PbHhDZJw1fd68YX36lCN-Q),提取码：`dt3y`。建议自行下载最新的。

## 其它
&emsp;结合mapbox贴图，能做到更佳的效果：[Create any City in Blender in 20 Minutes - YouTube](https://www.youtube.com/watch?v=NW_djQS_N8U)。

## 附录
- [Blender OSM-YouTube](https://www.youtube.com/watch?v=Thx08Q4etVc)
- [Blender GIS](https://github.com/domlysz/BlenderGIS)
