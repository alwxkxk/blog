---
title: 【软硬结合】chrome开发者工具
toc: true
abbrlink: 52429
date: 2018-09-07 09:20:37
tags:
- chrome
---
&emsp;开发者工具十分重要，这里只写一些刚入门常用的模块。（等你达到进阶水平后自然而然就会需要高级的功能，自然而然就会去自学。）。其它浏览器一般也会有调试工具，操作上不尽相同，功能上也肯定比不过最主流的chrome浏览器（微信小程序的开发本质还是网页开发，里面的调试工具也是用这个的），建议使用chrome浏览器。这里以上一节HTML、CSS、JS基础的作业为分析对象：[HTML、CSS、JS基础练习.rar](https://test-1251805228.file.myqcloud.com/%E7%A4%BA%E4%BE%8B%E4%BB%A3%E7%A0%81/HTML%E3%80%81CSS%E3%80%81JS%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.rar)
# 打开Chrome开发者工具
- 在Chrome菜单中选择 更多工具 > 开发者工具
- 在页面元素上右键点击，选择 “检查”
- 使用 快捷键 Ctrl+Shift+I (Windows) 或 Cmd+Opt+I (Mac)

# 元素面板
&emsp;元素面板（Element）功能是：
- 检查和调整页面
- 编辑样式
- 编辑DOM

<iframe src="//player.bilibili.com/player.html?bvid=BV1mp4y1t7YT&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>


1. 可以分析HTML与CSS内容，分析某个元素是怎么布局与设置样式。（去分析别人的网站怎么做的，提升自己水平）。
2. 实时修改HTML与CSS马上可以看到效果，__调整至最佳效果再去写代码__。（没学这个的新手会反复修改代码，保存，刷新再看效果再修改，这样效率低下。）

# 控制台面板
&emsp;控制台面板（Console）功能是：
- 查看打印信息（有过滤功能）
- 命令行交互

<iframe src="//player.bilibili.com/player.html?bvid=BV1rB4y1A7bk&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

1. 我经常会在这执行调试代码（需要先将变量引入到全局），以调试JS代码效果。

# 源代码面板
&emsp;源代码面板（Sources）功能是：
- 断点调试（可带条件打断点）

<iframe src="//player.bilibili.com/player.html?bvid=BV1to4y1f7EE&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

1. 断点调试是代码调试的重要手段，可以看到变量的实时值。（调试代码两大流派：断点流，打印流）

&emsp;除了JS代码可以打断点,还有DOM变化，XHR请求，事件监听：
- DOM变化
![DOM变化](/blog_images/DOM变化.webp)
- XHR请求
![XHR请求](/blog_images/XHR请求.webp)
- 事件监听
![事件监听](/blog_images/事件监听.webp)

# 网络面板
&emsp;网络面板（Network）功能是：
- 免缓存（Disable cache）
- 资源请求详情（请求、响应、时间轴）

<iframe src="//player.bilibili.com/player.html?bvid=BV1o54y1L7RP&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

1. 常用来分析请求。
2. 浏览器有缓存机制（有时修改了代码，浏览器刷新还是使用旧代码），有时需要开启免缓存。
# 其它
&emsp;这些面板新手并不需要用到。
## 性能面板
- 分析运行时性能
## 内存面板
- JavaScript CPU 分析器
- 内存堆区分析器
## 应用面板
&emsp;使用资源面板检查加载的所有资源，包括IndexedDB与Web SQL数据库，本地和会话存储，cookie，应用程序缓存，图像，字体和样式表。
# 附录
[Chrome浏览器 开发者工具-官方教程(要梯子)](https://developers.google.com/web/tools/chrome-devtools/?hl=zh-cn)