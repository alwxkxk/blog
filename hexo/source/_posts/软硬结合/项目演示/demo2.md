---
title: demo2
toc: true
tags:
  - IOT
abbrlink: 64594
date: 2018-11-03 10:05:02
---
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- 每次刷新页面才会显示最新的tick值。（讨论HTTP轮询以及websocket协议）
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 引入数据库，保存数据。


## 先跑起来
&emsp;demo2我已经部署到我自己的服务器，大家可在线浏览：[http://sh.scaugreen.cn/equipmentId/123456](http://sh.scaugreen.cn/equipmentId/123456)
![](http://ww1.sinaimg.cn/large/005BIQVbgy1fz4sstfxyxj31hc0t4npd.jpg)
&emsp;这里的`123456`就是客户端ID。如果结合demo2里的nodemcu程序（程序中id设置为`1234abcd`），就需要访问[http://sh.scaugreen.cn/equipmentId/1234abcd](http://sh.scaugreen.cn/equipmentId/1234abcd)。结合硬件的演示如下：

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo2%E6%BC%94%E7%A4%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;在演示中可以看到，手机控制开关灯。（硬件比较慢，大约一两秒才响应动作，应该是Arduino代码问题，但这并不影响我们示范。）

## demo2主要流程图
### 整体
&emsp;相对于demo1，demo2添加了数据库、websocket协议、图表库Echart。
![demo2主要流程图](http://ww1.sinaimg.cn/large/005BIQVbgy1fz5028sx4uj30qo0aj75r.jpg)

### 硬件变化
&emsp;nodemcu代码相对于demo1没有太大改动，主要是改变了TCP端口以及每秒发送随机数（模拟传感器实时取得的温度值）。此代码可在[项目代码](https://github.com/alwxkxk/soft-and-hard)里的`demo2/nodemcu`找到。
```c
const int port = 9003;//demo2 tcp 使用 9003端口

// TCP发送20-29之间随机数
client.print(20+random(0,10));
```

### HTTP客户端变化
&emsp;demo1的界面是将所有连接的设备显示出来，手动刷新获取最新值，选中某个设备发送开/关灯命令。
&emsp;demo2的界面是进入网页时就已经指定了某个单一设备，只要设备不断地上传数据，界面就实时地把数据在图表中显示出来，点击按钮发送开/关灯命令。
![](http://ww1.sinaimg.cn/large/005BIQVbgy1fz50jf130yj31co0qfqv5.jpg)
&emsp;界面为了追求一定程序的美化，所以加了很多没有实质性作用只是单纯为了更好看的内容。此代码是在express框架内，可在[项目代码](https://github.com/alwxkxk/soft-and-hard)里的`demo2/myapp/views/index.pug`找到界面代码，`demo2/myapp/public/javascripts/index.js`找到JS代码。JS代码主要做了几件事：
1. 创建websocket连接，接收该设备的实时数据。
2. 给开/关按钮添加POST请求代码。
3. 初始化Echart图表，用于显示实时数据。
4. 请求历史数据，在Echart上显示。

### 服务器端变化
&emsp;服务器端的代码在demo1上增加内容：
1. 增加MongoDB数据库操作，TCP服务器接收到的所有数据都存入到数据库中（只保留一个小时的历史数据）。
2. 增加websocket，给界面提供实时数据。
3. 增加TCP客户端模拟器（tcp-client，id号为`123456`），代表硬件不断产生数据，可以在没有硬件的情况下也能从界面看到实时数据。


## 学习过程
&emsp;在模仿demo2之前，需要学习：
- [数据可视化基础](/posts/18173)
- [HTTP协议基础](/posts/34265),里面讨论了HTTP轮询的不足与websocket协议的最简例子。
- [数据库基础](/posts/41347)

&emsp;以上是网页的制作，可接着阅读如何跨到其它平台，按需学习：
- [微信小程序基础](/posts/15341)
- electron基础
- PWA基础
&emsp;MQTT协议在物联网应用中十分流行，可单独学习整合（为了不让demo2跨度过大，所以就不整合到demo2里演示）：
- [MQTT协议基础](/posts/20945)
&emsp;demo2学习完后，整个教程就到了尾声，所有关键技术都已经介绍完了，剩下的无非是业务逻辑代码编写（比如帐号注册登陆、页面设计等等，不同的业务不同的设计）。

