---
title: 亲手demo0.1
toc: true
abbrlink: 38208
date: 2019-03-17 09:49:12
tags:
---



## NodeMCU突然断开连接
&emsp;现在我们已经把TCP服务器端程序写好了，并且能定时控制NodeMCU开关灯了。这里提一个风险点，就是NodeMCU突然断开（网络通信突然挂了，或者NodeMCU突然断电了），会怎么样？




&emsp;大家尽量使用chrome浏览器，其它浏览器可能会出现问题。（比如说IE内核的浏览器不支持ES6。）
&emsp;demo0.1是demo1的简化版：
- 只支持一个TCP连接，简化了TCP服务器的代码。
- 简陋的网页，无需先学习Jquery、Bootstrap。
- 不使用express框架、无需先学习框架。

&emsp;demo0.1虽然删去了大部分功能，但仍然需要HTML、CSS、JavaScript基础、nodejs基础、nodemcu基础：

- [计算机网络基础](/posts/37707)
&emsp;先了解基本的网络知识，半个小时吧。

- [nodemcu基础](/posts/31494)
&emsp;了解nodemcu与开发，两三个小时吧。

- [HTML、CSS、JS基础](/posts/54080)
&emsp;了解界面开发的三件套基础知识，__结合其它教程自学，大约两三个星期__，能做出基本的网页界面。

- [nodejs基础](/posts/56793)
&emsp;了解nodejs开发、ES6语法、express框架，__结合其它教程自学，大约两个星期__。

## 先跑起来
<iframe src="//player.bilibili.com/player.html?bvid=BV1H54y147cu&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video "> </iframe>   



&emsp;先安装Nodejs环境，[nodejs基础](/posts/56793)。然后跑起来，按`README.md`里操作，执行`node server.js`(为了避免歧义，将原本叫index.js的脚本更名为server.js，视频中是旧的做法，依然执行`node index`。)启动程序，打开浏览器访问`127.0.0.1:8000`就能看到页面，使用网络调试助手TCP客户端连接上`127.0.0.1:9000`，就可以进行数据传输，如果要使用硬件连接注意IP地址要写内网地址。效果如视频所示：

<iframe src="//player.bilibili.com/player.html?bvid=BV1fb4y1D7PE&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>


&emsp;我也部署到我自己的云服务器上，可直接尝试：
- 网址：http://42.192.168.165:8000/
- TCP服务器：42.192.168.165:9000

## 其它说明
- 在demo0.1里使用了HTTP轮询，所以demo0.1能每秒能刷新出最新数据显示到网页上。而在demo1里，并没有这样做。同样，ESP8266模块使用AT固件也可以这样利用HTTP轮询不断地拿最新数据，粗暴简单地实现远程控制。HTTP轮询的代价是性能差，浪费资源。
- GET /open 这种写法其实是不符合规范约定，等后面了解到RESTful自然会明白，但在这里也可以这样简单粗暴地达到目的。


## FAQ
1. 为什么TCP监听`0.0.0.0`，但用浏览器访问的是`127.0.0.1`？
__答：在服务器端，`0.0.0.0`代表的是本机所有的IP地址，`127.0.0.1`代表的是本机。监听`0.0.0.0`代表其它设备可以通过任一个本机的IP地址来访问通信，而访问`127.0.0.1`代表访问本机提供的服务。__
