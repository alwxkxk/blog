---
title: demo1
toc: true
abbrlink: 64786
date: 2018-11-01 19:57:07
tags:
- IOT
---

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

## 先跑起来
&emsp;首先你手上先有一块nodemcu（淘宝价十几块），按[nodemcu基础](/posts/31494)先跑几个例程，保证硬件上没有问题。服务器与界面我已经写好了，并部署到我的服务器上（后面会演示怎么在你本地部署），具体代码自行查看demo1代码。demo1尽量追求简单入门，所以界面不好看，性能也不足，后面会讨论如何优化。整个demo1完成后，你就会对整个物联网的项目有个基本的认识，可以大大地讨论哪个环节需要怎么开发，跟别人吹水一点都不虚。
- 网址：http://119.29.107.47:8001/
- TCP服务器：119.29.107.47:9002

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo1.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;如果你才下单刚买nodemcu还没到手，可以先粗略快速地浏览一下其它教程，在没有硬件的情况下都可以先学习，特别是网络知识部分。demo1流程图：

![demo1流程图](http://ww1.sinaimg.cn/large/005BIQVbgy1fx3yhijxgkj30fb0b7aa6.jpg)

&emsp;当然，如果你说不想买硬件，想通过直接通过软件模拟，看看效果，也是可以的。只需要用网络调试助手[-百度网盘下载](https://pan.baidu.com/s/1XBpeUK9QcA0r90yZkIe6fg)，连接到demo1服务器端，连接成功后发送一条字符串当作设备id，也是可以模拟出来，只是没有硬件能直接控制LED灯开关那么直观而已。__大家一定要建立一种等效替换的意识，不管你手上是nodemcu还是单片机+ESP8266，还是什么其它比如4G模块、NB-IOT模块，对于服务器来说本质都是TCP客户端，没有任何区别，所以在调试时完全可以单纯地使用软件来等效替换。__ 在实际调试开发中，经常都需要把硬件与软件各自分开来调试，直到两者都调试正常验证正确之后，才会把软件硬件一起联调。

<img class="lazy" alt="网络调试助手模拟demo1" data-src="http://ww1.sinaimg.cn/large/005BIQVbgy1fxuzdtrbasg31gy0rib2a.gif">

## 在自己电脑上跑起来
&emsp;先不用急着学，让这个项目能在你手上完整地跑起来，先拥有它，能不能驾驭是另一回事。下面傻瓜式演示怎么把demo1在自己电脑上跑起来。
### 获取源码
&emsp;完整的源代码可以到[github](https://github.com/alwxkxk/soft-and-hard)里下载，并解压。
![获取全部源码](http://ww1.sinaimg.cn/large/005BIQVbgy1fxa4jvz5xtj30ty0lvwi8.jpg)
### 安装环境
&emsp;服务器代码是用nodejs写的，所以要先安装nodejs。
1. 搜索nodejs官网
2. 下载nodejs，大家下载稳定版本（LTS: Long Term Support ）。安装一直点下一步即可。
![下载nodejs](http://ww1.sinaimg.cn/large/005BIQVbgy1fvbmhyji22j30xk0rn0v5.jpg)
3. 在cmd里运行`node -v`与`npm -v`验证nodejs安装成功
![验证nodejs安装成功](http://ww1.sinaimg.cn/large/005BIQVbgy1fvbmigtxlcj31hc0t4jw0.jpg)
### 安装依赖包并运行
&emsp;如果你有nodejs与git的使用经验就会知道，默认的作法是只上传源码，而依赖包自行安装以减少git文件体积。注意需要进入到对应的目录，可以看视频操作：
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo1%E6%9C%AC%E5%9C%B0%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;整个过程因为没有相关基础知识，所以并不懂，很正常，经过后面的学习就会了解整个过程。readme是以MarkDown语法写的。

### 瞎折腾
&emsp;虽然说读者可能到现在什么都不懂，但这里演示如何瞎折腾，让读者获得一下拥有感，演示一下修改网页内容：
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo1%E7%9E%8E%E6%8A%98%E8%85%BE%E6%BC%94%E7%A4%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
## 怎么做
&emsp;具体的技术选型不再讨论，可阅读[软硬结合](/posts/44755/)，结论就是：
- 硬件：nodemcu，使用Arduino IDE进行开发，与服务器使用TCP通信
- 服务器：Nodejs，使用express4.x框架
- 界面：HTML+CSS+JavaScript，Jquery与Bootstrap

### 学习过程
- [计算机网络基础](/posts/37707)
&emsp;先了解基本的网络知识，半个小时吧。
- [nodemcu基础](/posts/31494)
&emsp;了解nodemcu与开发，两三个小时吧。
- [HTML、CSS、JS基础](/posts/54080)
&emsp;了解界面开发的三件套基础知识，__结合其它教程自学，大约两三个星期__，能做出基本的网页界面。
- [chrome开发者工具](/posts/52429)
&emsp;学习怎么调试网页，分析别人网页，__拥有分析并模仿别人的网页的能力__。
- [Jquery、Bootstrap基础](/posts/27238)
&emsp;学习Jquery、Bootstrap基础。__并尝试模仿别人网页，检验学习成果。__
- [nodejs基础](/posts/56793)
&emsp;了解nodejs开发、ES6语法、express框架，__结合其它教程自学，大约两个星期__。
- 模仿demo1，尽可能地自行实现demo1效果，大约几天。

## 下一个demo
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- 每次刷新页面才会显示最新的tick值。（讨论HTTP轮询以及websocket协议）
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 硬件与服务器之间改用MQTT协议进行通信
- 引入数据库
&emsp;在实现下一个demo之前会讨论解决以上问题，之后会做出一个能看能用的demo，同时会介绍其它技术。

## FAQ
1. 为什么我点击按钮没能控制LED灯亮灭？
__答：可打开开发者调试工具查看是否有报错，IE浏览器，360浏览器内核太旧无法支持新版的JQuery而报错，大家请改用chrome浏览器。__







