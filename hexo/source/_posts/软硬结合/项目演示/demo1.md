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
&emsp;（本来是想不用框架直接使用nodejs提供的API来写，但发现不用框架根本写不起来....怎么解析POST数据都是个麻烦事，能写出来，给新手讲肯定也讲不清。）


# 怎么做
&emsp;具体的技术选型不再讨论，可阅读[软硬结合](/posts/44755/)，结论就是：
- 硬件：nodemcu，使用Arduino IDE进行开发
- 服务器：Nodejs
- 界面：HTML+CSS+JavaScript






