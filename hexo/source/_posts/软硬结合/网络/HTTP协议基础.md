---
title: HTTP协议基础
toc: true
abbrlink: 34265
date: 2018-09-16 20:05:01
tags:
- HTTP
---

&emsp;HTTP协议是基于TCP/IP协议之上的应用层协议，用于创建网页的标准标记语言。
&emsp;何为基于TCP协议呢？我们这里做一个小实验，使用网络调试助手本地开启一个TCP服务器，再使用浏览器去访问。如下图所示，TCP服务器监听`0.0.0.0:2424`，使用浏览器访问网址`127.0.0.1:2424`：

![](/blog_images/005BIQVbgy1fxqbygl67lg31gy0rix65.gif)

```
GET / HTTP/1.1
Host: 127.0.0.1:2424
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: Hm_lvt_646acd4e6c74eb119c3d5d93c5bfde70=1543030512; connect.sid=s%3AFxuAcuznrgwRTgZHRvWbjpQrByLHxpct.ZZOBJiBRG5fcuPx4YI0Q6EM1CB11v3fv%2Bo1sjk9ht3E; io=Cr4WfqvVMqyQCazgAAAk
```
&emsp;很明显，HTTP协议就是在TCP协议之上，按照一定的规则传输一些字符串。同理，反过来，如果你使用TCP客户端向HTTP服务器端发送类似的字符串，一样能被当作HTTP协议内容进行解析。具体这几行代表什么，可以看 __《图解HTTP协议》__ ，不再多讲。我就只简单讲一下前两行：第一行代表，访问根目录，通信协议是HTTP1.1版本。第二行代表，客户端的地址是`127.0.0.1:2424`。
&emsp;这就是基于TCP协议，如果你之前有学习过[TCP协议基础](/posts/19508/)就知道，我们控制硬件开关灯，用`1`代表开灯，用`0`代表关灯，这就是我们定义的内容，而HTTP内容比较多，它定义的东西也就多了。

## 相关书籍
![HTTP入门](/blog_images/005BIQVbgy1fz2vras1z6j30ss0d7413.jpg)

## HTTP两大特点
- 无连接：限制每次连接只处理一个请求，处理完就断开连接。
&emsp;简单来讲，就是你发一个HTTP请求只能得到一个回应，我经常简称为“一问一答”，不可能出现你请求一次，它回应N次的情况。所以要想实时更新内容，就必须轮询（HTTP轮询），每隔一段时间就发起一次请求，“现在最新温度是多少呀？”，它才会响应一次“现在最新温度是XX度。”。这造成了性能问题，后面会进一步讨论。
- 无状态：HTTP协议本身没有记忆能力。
&emsp;没有记忆能力代表HTTP协议本身并不知道你是新访问者还是旧访问者，这会导致一个问题，很多网站必须要记住已经登陆过的用户，总不能每刷新一次页面就要求用户重新输入帐号密码。为了能实现这个功能，HTTP服务器开发者还必须额外利用cookies与session来实现记忆功能，对于cookies与session网上有很多相关资料，有兴趣自行搜索，不再详说。

![自行搜索](/blog_images/005BIQVbgy1fxs888urn6j30nv0amwg5.jpg)

## Ajax
&emsp;Ajax 即“Asynchronous Javascript And XML”（异步 JavaScript 和 XML），Ajax 是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。如果每次HTTP请求都把整个网页都刷新一次的话，代价太高了，用户体验太差，所以就需要利用Ajax技术。网上有很多相关资料，有兴趣自行搜索，不再详说。

## HTTP2
&emsp;前面说到，HTTP协议是每一个请求只返回一次应答，这意味着如果一个网页需要加载十个JS文件与CSS文件，就必须要发起十次请求，就要进行十次TCP三次握手。为了提高性能，新推出的HTTP2协议，只需要发起一次请求，就会把这十个文件在一性次全部返回给你，才断开连接，整个过程只需要一次TCP三次握手。有兴趣自行搜索，不再详说。
&emsp;你问我为什么一开始不这样设计？当年HTTP诞生的时候，就已经满足了当年的需求，要知道当年的网页就是一堆文字罢了。谁都没想到现在HTTP已经发展到这样大型的怪物。

## HTTPS协议
&emsp;HTTP协议有一个很严重的安全性问题，它所传输的数据是明文传输，所以别有用心的人能够在传输的过程中获取其内容。一方面，网页设计时不能把密码直接发送到HTTP服务器，理应先从客户端进行加密再传输。另一方面，应该使用HTTPS协议，让整个HTTP内容都加密，让别人无法分析。

## RESTful
&emsp;一种设计风格，使用起来能够让软件显得更加简洁。简单来说，在设计API时，URL应该指资源名，不同的动作使用不同的方法来请求。先简单举个反例：
- GET /user：获取帐号信息
- POST /create-user 创建用户
- POST /delete-user 删除账号
&emsp;而遵守RESTful风格，只需要同样一个URL，利用不同的HTTP方法代表不同的动作，显得更加简洁：
- GET /user：获取帐号信息
- DELETE /user：删除帐号
- POST /user：创建或更新帐号信息

## WebSocket协议
&emsp;建立TCP通信之后，服务器端是能向客户端随时随地主动发数据。但HTTP协议的设计就是无连接，“一问一答，不问不答”，客户端不发起请求，服务器不能主动向客户端发送数据。在一些追求实时性的应用场景下，硬是使用HTTP轮询的办法去获取最新的数据，这就有严重的性能问题。如果轮询时间太短，机器扛不住。如果轮询太长，那么数据更新得太慢。即HTTP协议缺乏实时性，能不能像TCP socket通信一样，建立通信后不断开连接，并且能让服务器主动向客户端发送数据。基于这样的理念，就诞生了WebSocket协议，允许在上HTTP协议基础之上，达到TCP socket通信一样的效果。
&emsp;在追求实时性应用场景里，比如说聊天室，物联网应用，都会用到WebSocket协议，赋予界面实时更新数据的能力。举个例子，现在我想实时显示温度，若使用HTTP协议轮询，要更新十次数据就需要发起十次请求，“十问十答”。使用WebSocket协议只需要发起一次请求，就可以做到“一问十答”，由服务器主动推送数据给浏览器：
![](/blog_images/005BIQVbgy1fyb439gt6pj30fj0eat9x.jpg)

&emsp;`http://websocket.org/`提供了一个websocket测试网址，会回复所接收的数据(echo:回声)，源代码可在[项目代码](https://github.com/alwxkxk/soft-and-hard)里的`\基础教程\HTTP协议基础\WebSocket例子`找到:

<img class="lazy" alt="WebSocket" data-src="/blog_images/005BIQVbgy1fydgd0oltfg31gy0ri4qp.gif">
![](/blog_images/005BIQVbgy1fydgb1rhp2j31hc0t4goc.jpg)

&emsp;服务器端可以使用[ws模块](https://github.com/websockets/ws)搭建WebSocket服务器，然后就可以使用从浏览器直接调用 WebSocket API进行连接。而在平时开发使用，一般开发者会使用[socket.io模块](https://github.com/socketio/socket.io)，这个是在WebSocket协议基础之上，增加了一系列功能如：支持命名空间、超时重连、若浏览器不支持WebSocket则自动降级使用HTTP轮询等等。使用socket.io时，并不能直接使用浏览器的WebSocket API连接，必须使用socket.io库。为方便学习，不增加太多新概念，服务器端我们使用ws模块进行演示。具体代码可查看[源代码](https://github.com/alwxkxk/soft-and-hard)`\基础教程\HTTP协议基础\Websocket服务器端例子`，运行前先阅读该目录下的`README`。

## 作业
1. 学习使用postman模拟HTTP请求，并了解POST提交数据方式。
[四种常见的 POST 提交数据方式](https://imququ.com/post/four-ways-to-post-data-in-http.html)


## 附录
[HTTP协议规范文档-rfc2616](https://tools.ietf.org/html/rfc2616)