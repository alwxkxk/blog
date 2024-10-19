---
title: 【软硬结合】亲手实现demo0.1
toc: true
abbrlink: 38208
date: 2019-03-17 09:49:12
tags:
img: /blog_images/demo1示例.webp
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
- [NodeMCU基础](/posts/31494)
- [demo1跑起来](/posts/64786/)
- [demo2跑起来](/posts/64786/)
- [部署到云服务器](/posts/31687/)
- [计算机网络基础](/posts/37707)
- [NodeMCU与网络调试助手联调](/posts/7602)
- [使用NodeJs实现TCP服务器](/posts/58215)
- [HTML、CSS、JS基础](/posts/54080)
- [使用NodeJs实现HTTP服务器](/posts/33173) 

## 本篇学习内容
- 介绍demo0.1
- 讨论一下心跳机制（heartbeat）
- 简单了解一下断点调试
- 尝试自己实现demo0.1

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=11" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 介绍demo0.1
&emsp;demo0.1示例代码在项目里可以找到。从程序上来讲，NodeMCU（TCP客户端）与TCP服务器通信，手机浏览器（HTTP客户端）与HTTP服务器通信，最终实现通过网页控制NodeMCU的LED。完成demo0.1，软硬件基本打通了，后面做的事就是锦上添花，不断完善。
![demo1示例](/blog_images/demo1示例.webp)

## NodeMCU突然断开连接
&emsp;现在我们已经把TCP服务器端程序写好了，并且能定时控制NodeMCU开关灯了。这里提一个风险点，就是NodeMCU突然断开（网络通信突然挂了，或者NodeMCU突然断电了），会怎么样？
&emsp;根据TCP协议，关闭连接是需要发出关闭连接的信息，但是遇到“非正常”情况，TCP客户端会无法正常地发出关闭连接，导致 __TCP服务器以为TCP客户端还在连着，但实质TCP客户端已经断开连接的情况__。在实践中你也可以验证一下，那就是使用网络调试助手正常关闭连接时，TCP服务器端是能马上知道这个TCP连接已断开。而让处于连接状态下的NodeMCU突然断电，会发现TCP服务器端并不能马上发现这个TCP连接已断开，因为NodeMCU根本就没机会出发关闭连接的信息。相关讨论可以参考：
- [《TCP/IP详解 卷一》第23章 TCP的保活定时器](http://docs.52im.net/extend/docs/book/tcpip/vol1/23/)
- [stackoverflow - Instantly detect client disconnection from server socket](https://stackoverflow.com/questions/722240/instantly-detect-client-disconnection-from-server-socket)

## 心跳机制
&emsp;意外情况导致TCP服务器没意识到该TCP客户端已经断开连接，会导致很多问题。比如说明了已经断开连接了，界面还在显示着该设备还在线，这明摆着就是错误的显示。
&emsp;为了解决这种问题，常见的做法就是引入心跳机制（heartbeat）。TCP服务器端设定一个心跳超时时间，如果在这时间范围内没收到TCP客户端的数据，就认为该TCP客户端已经断开连接。所以TCP客户端在每隔一段时间内都必须发送一次数据，即便没什么数据可发送的，也要发一个数据（该数据自行定义即可），以证明你还活着。
&emsp;对应的，代码中会给TCP设置超时时间：

```js
var TIMEOUT = 30*1000;//tcp客户端超过60秒没发数据判为超时并断开连接
var tcpServer = net.createServer((socket)=>{
  // ...
  socket.setTimeout(TIMEOUT);
  // 超过一定时间 没接收到数据，就主动断开连接。
  socket.on('timeout', () => {
    console.log(socket.id,socket.addr,'socket timeout');
    socket.end();
  });
})

```

&emsp;为了验证，你可以把这部分代码注释掉，然后把处于连接状态的NodeMCU板子突然拔出来断电，可以发现界面会一直认为NodeMCU还没断开。如果有这部分代码，界面在超时时间后（代码里设定为30秒），就会认为已经断开。



## 断点调试
&emsp;我们之前一直都是通过打印信息来调试，看问题会出现在哪里。除了打印信息这个调试技巧之外，还有断点调试技巧也十分重要。在页面的JS可以在Chrome里设置断点，NodeJS的代码可以在vscode里打断点然后开启debug。

![](/blog_images/vscode断点调试.webp)


## demo0.1的问题
- 首当其冲就是太丑了，后面demo1会引入Bootstrap来美化一点点。
- 代码的逻辑是只能针对一个设备（为了让代码尽量简单），不能同时连接多台设备。
- API设计不合理，`GET /open` 这种API设计其实是不符合规范约定，GET方法往往代表着获取数据，而非执行动作。所以后面的demo1里，使用是的POST方法。虽然不符合规范约定，但在这里为了简单粗暴地实现功能，暂时这么做。执行开关灯时，应该改使用POST来执行动作。

&emsp;以上问题，会在demo1尝试解决。



## 阶段性作业
&emsp;注意，到这节课，你必须要亲自敲代码，自己从零实现demo0.1，完成这个阶段性作业，才代表着你之前的课程搞明白了，把软硬件初步打通。如果遇到什么不懂的问题，不懂的语法，记得在Q群提出来。如果没有敲出来，说明相关知识还没学懂，还不足以进入一下节。


## 附录
[HTTP协议规范文档-rfc2616](https://tools.ietf.org/html/rfc2616)



