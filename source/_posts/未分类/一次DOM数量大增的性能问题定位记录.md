---
title: 一次DOM数量大增的性能问题定位记录
toc: true
abbrlink: 40736
date: 2023-06-19 11:23:53
tags:
---

&emsp;最近开发时，发现有个页面使用一个canvas库：[konvajs](https://konvajs.org/)加载图纸时，发现用时比较久，而且在Chrome性能监测面板Performance monitor发现会有DOM数量大增的问题。在几千DOM元素，一下子增加了几万DOM元素。

![PerformanceMonitor](/blog_images/未分类/PerformanceMonitor.webp)

&emsp;沉思了一会，新增的DOM元素应该在页面上有所体现。于是，我在DOM大增之前，之后各复制一次DOM元素，放到文件里，使用[vscode来进行文件对比](https://blog.csdn.net/qq_32642107/article/details/89343107)，发现DOM元素也就在后面只新增了几百行而已。

![PerformanceMonitor](/blog_images/未分类/复制DOM元素.webp)
![PerformanceMonitor](/blog_images/未分类/vscode文件对比操作.webp)

![PerformanceMonitor](/blog_images/未分类/vscode文件对比.webp)

&emsp;这就让我想不明白了，新增的几万个DOM是在哪里新增的呢？尝试注释了一些代码，发现是konvajs加载图纸前后导致的，此时我还在思考这不合理啊，canvas里的元素怎么会导致DOM元素大增呢。再进一步定位测试，最终确认了是cache函数导致的，因为我把很多元素通过cache函数进行“性能优化”，而这个函数是将元素转换成图片进行优化（即DOM图片元素里），这就是导致DOM元素大增的原因。 

&emsp;于是我就把这负优化的代码删去，成功定位并解决问题。

## 附录
- [用Visual Studio Code对两个文件进行比较](https://blog.csdn.net/qq_32642107/article/details/89343107)

