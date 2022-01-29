---
title: Arduino开发板管理安装package_esp8266com_index.json失败的解决办法
toc: true
abbrlink: 10960
date: 2019-04-11 19:58:54
tags:
- Arduino
- ESP8266
- nodemcu
---

&emsp;有读者学习nodemcu时，通过Arduino IDE开发板管理器安装esp8266开发板时发现安装速度极慢，甚至安装不下来。
## 原因
&emsp;外国人开发的东西一般会放在亚马逊云服务上，而因为众所周知的原因有一部分外网是不可访问的（墙，一般是程序员学习的最大障碍），所以导致下载文件速度过慢甚至无法下载。最好的解决办法，当然是使用梯子，然而这对于大部分初学者来说过于困难。

## 解决办法一：复制替换

&emsp;Arduino 官方论坛讨论[能否手动安装开发板](https://forum.arduino.cc/index.php?PHPSESSID=25g88vvos46pi5vku2pf51stf0&topic=463573.msg3480758#msg3480758)里提到，可以从一台已经安装好了的，复制一份到自己电脑上就可以了。我windows10、64位电脑已经安装成功的package_esp8266com_index（[百度网盘链接](https://pan.baidu.com/s/1dqqfs-Ka2x3-b8SOoqJlGw) ，提取码：05gl ），可供大家复制替换。具体做法是：解压文件，找到 
`C:\Users（在操作中是显示中文：用户）\alwxkxk（这是我的用户名，你找你的电脑用户名）\AppData\Local\Arduino15`，演示的时候发现`AppData`是隐藏文件夹，需要手动设置显示隐藏文件夹才能显示出来（点击上方的查看，然后把右边的 隐藏的项目勾上。）。

![显示隐藏文件](/blog/blog_images/显示隐藏文件.webp)

&emsp;然后把整个`Arduino15`文件删除，把解压得到的文件替换过去,附加开发板管理器网址仍旧填 
`http://arduino.esp8266.com/stable/package_esp8266com_index.json`,就能发现已经安装成功2.5.0了。
&emsp;这种方法可能对32位系统、ARM架构等等不同的电脑无法生效，那么就要下面的终极方法。

## 解决办法二：本地代理

&emsp;我写了一个小工具[下载转换器](https://github.com/alwxkxk/downloadConverter)（暂未整理好源码），将一个文本里的所有网址的内容都下载下来，并把网址都改成了另一个网址。所以我将
`http://arduino.esp8266.com/stable/package_esp8266com_index.json`
&emsp;里的所有提到的文件全部都下载下来，并打包成exe。运行后，可以将网址填入
`http://127.0.0.1/package_esp8266com_index.json`
&emsp;，就可以正常安装。
&emsp;文件有点大，1.3G，可用其它插件或工具来加速下载，如[速盘](https://www.speedpan.com/)等。（[百度网盘链接](https://pan.baidu.com/s/114253X4j4GJPgOKEHdlAbw) ，提取码：3d3c ），完整视频如下：

<iframe src="//player.bilibili.com/player.html?bvid=BV1XU4y1h79q&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 其它问题
&emsp;如果出现其它报错提示，尝试将`Arduino15`删除，再重复步骤尝试。

## 附录
- [Arduino IDE 库文件如何添加？](http://yfrobot.com/thread-11842-1-1.html)
- [Arduino-IDE-1.6.x-package_index.json-format-specification](https://github.com/arduino/Arduino/wiki/Arduino-IDE-1.6.x-package_index.json-format-specification)
注意文件名必须是`package_YOURNAME_PACKAGENAME_index.json`才能让IDE正常识别。

