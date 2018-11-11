---
title: demo1
toc: true
abbrlink: 64786
date: 2018-11-01 19:57:07
tags:
- IOT
---

# 简介
&emsp;搭建一个最简单的物联网项目：通过手机控制LED灯开关。
&emsp;从程序上来讲，nodemcu（TCP客户端）与TCP服务器通信，手机浏览器（HTTP客户端）与HTTP服务器通信，最终实现通过网页控制nodemcu的LED。
![demo1示例](http://ww1.sinaimg.cn/large/005BIQVbgy1fwstl5y6srj30il0950tp.jpg)


&emsp;搞物联网，首先要懂网，属于最重要的基础知识：网络相关有三节教程：[计算机网络基础](/posts/37707/)、[IP协议基础](/posts/37286/)、[TCP协议基础](/posts/19508/)。当然，要搞东西并不需要完成理解100%才动手，一般开始只需要快速浏览大概留个印象即可，暂时我们只要明白几个知识点：
- IP地址：代表一个设备在网络中的地址
- 端口号：代表设备上某个正在运行的程序
- 两台设备之间的网络通信：代表着两个（IP地址+端口）在通信
- 客户-服务器模型（client-server model）

&emsp;从IP地址与端口号的角度来看，三台设备之间通信（这里IP地址与端口是随意配的以作演示），示意是这样的：
![demo1通信示意](http://ww1.sinaimg.cn/large/005BIQVbgy1fwtxx9phabj30jk095jse.jpg)

# 先跑起来
&emsp;首先你手上先有一块nodemcu（淘宝价十几块），按[nodemcu基础](/posts/44755/)先跑几个例程，保证硬件上没有问题。服务器与界面我已经写好了，并部署到我的服务器上（后面会演示怎么在你本地部署），具体代码自行查看demo1代码。demo1尽量追求简单入门，所以界面不好看，性能也不足，后面会讨论如何优化。整个demo1完成后，你就会对整个物联网的项目有个基本的认识，可以大大地讨论哪个环节需要怎么开发，跟别人吹水一点都不虚。
- 网址：http://119.29.107.47:8001/

<video class="lazy" controls data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/demo1.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;如果你才下单刚买nodemcu还没到手，可以先粗略快速地浏览一下其它教程，在没有硬件的情况下都可以先学习。demo1流程图：
![demo1流程图](http://ww1.sinaimg.cn/large/005BIQVbgy1fx3yhijxgkj30fb0b7aa6.jpg)


# 怎么做
&emsp;具体的技术选型不再讨论，可阅读[软硬结合](/posts/44755/)，结论就是：
- 硬件：nodemcu，使用Arduino IDE进行开发，与服务器使用TCP通信
- 服务器：Nodejs，使用express4.x框架
- 界面：HTML+CSS+JavaScript，Jquery与Bootstrap

# 下一个demo
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- 每次刷新页面才会显示最新的tick值。（讨论HTTP轮询以及websocket协议）
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 硬件与服务器之间改用MQTT协议进行通信
- 引入数据库
&emsp;在实现下一个demo之前会讨论解决以上问题，之后会做出一个能看能用的demo，同时会介绍其它东西比如docker，electron等技术。这个demo2估计需要比较长的时间进行准备。






