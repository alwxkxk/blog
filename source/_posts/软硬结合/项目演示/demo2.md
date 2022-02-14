---
title: 【软硬结合】demo2跑起来
toc: true
tags:
abbrlink: 64594
date: 2018-11-03 10:05:02
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
- [NodeMCU基础](/posts/31494)
- [demo1跑起来](/posts/64786/)

&emsp;demo1尽量追求简单入门，demo2在demo1的基础上添加了：
- 界面优化，使用echart图表来显示温度值。
- 使用websocket代替HTTP轮询提高性能。
- 使用数据库保存历史数据。

## 本篇学习内容
- 先看看已经部署到线上的demo2，让NodeMCU连上去。
- 安装MongoDB，并把demo2在本地跑起来。
- 用手机访问网页，进行控制。

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=4" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>


## 先跑起来
&emsp;demo2我已经部署到我自己的服务器，大家可在线浏览：
- 界面网址：[http://42.192.168.165:8002/equipmentId/123456](http://42.192.168.165:8002/equipmentId/123456)
- TCP服务器：42.192.168.165:9003

&emsp;[http://42.192.168.165:8002/equipmentId/123456](http://42.192.168.165:8002/equipmentId/123456)
![](/blog_images/demo2效果图.webp)
&emsp;这里的`123456`就是客户端ID，这是为了方便调试验证想法，使用JS代码模拟出一个TCP客户端来，模拟成是“NodeMCU”在不断上传数据，访问这个页面只是在看“模拟数据”，并不是真实的硬件。
&emsp;NodeMCU的demo2例程，程序中id设置为`1234abcd`，所以使用NodeMCU连接到线上的demo2之后，就需要访问[http://42.192.168.165:8002/equipmentId/1234abcd](http://42.192.168.165:8002/equipmentId/1234abcd)，这个页面才是真实的你的硬件的数据（当然也有可能是，同一时间有其它读者使用这个相同的id，导致相互干扰，所以你可以尝试把id修改成你喜欢的值，再去访问对应的网页）。结合硬件的演示如下：

<iframe src="//player.bilibili.com/player.html?bvid=BV1x64y1i7Lt&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 本地把demo2跑起来
&emsp;由于demo2使用了MongoDB数据库来保存历史数据，所以要先安装数据库。百度搜不出官网，我这里直接把网址放出来：[MongoDB](https://www.mongodb.com/try/download/community)，我选择的是版本4。在演示视频中，因为默认勾选了compase，导致一直卡在那里了。所以我们后面就不勾选它，手动下载[MongoDBCompass](https://www.mongodb.com/try/download/compass)再自行安装吧，这个是图形化界面来控制数据库的。
&emsp;具体部署与demo1类似，进入到对应的目录，使用命令`npm install`安装依赖，`npm start`运行。
&emsp;跑起来后，通过数据库客户端查看，大家可以看到demo2的模拟数据在不断地向数据库写入数据。
## 让NodeMCU连上本地的demo2
&emsp;然后修改NodeMCU demo2的代码，烧录到NodeMCU中，要确保NodeMCU与电脑是在同一个WIFI网络当中，IP地址修改成你电脑的 __IP地址__ ，就可以了在本地跑通demo2了。


## 手机访问并控制
&emsp;本地demo2跑起来后，可以尝试用手机来访问网页并控制，特别注意：手机与电脑及NodeMCU都必须在同一个WIFI里，否则手机无法访问电脑上所运行的demo2。（这是因为你自家的电脑是没有公有IP，无法通过外网访问的，只能在同一个局域网里通过IP地址来访问。）注意，虽然电脑填写了`127.0.0.1`，但是手机不能填写`127.0.0.1`，因为这是代表本机的意思，电脑可以访问本机因为代码就跑在电脑上，但手机不可以，它必须要访问电脑，所以要写电脑的IP地址。


## FAQ
1. 为什么一开始会提示一条保存数据失败？
__答：因为与连接数据库需要时间，当需要保存数据时但数据库还没连接成功的时候，就会出现保存数据失败。最近（19年10月30日）修改了代码，启动服务几秒后才会启动tcp-client，这个问题应该解决掉了。__

2. 为什么浏览器显示不了实时温度数据？
__答：之前可能是浏览器不兼容的问题，最近（19年10月30日）修改了demo2代码使其能兼容IE内核浏览器（不支持新语法导致报错）。如果还是有问题，请打开调试工具，把相关报错信息发给群里。（chrome是按F12 弹出调试工具）__ 

3. 请问网页上的那些图标是从哪里找的？
__答：[阿里图标库](http://iconfont.cn)。__ 
