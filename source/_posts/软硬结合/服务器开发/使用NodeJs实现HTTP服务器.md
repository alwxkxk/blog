---
title: 【软硬结合】使用NodeJs实现HTTP服务器
toc: true
abbrlink: 33173
date: 2021-08-08 16:49:23
tags:
img: /blog_images/TCP-IP协议模型.webp
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

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=10" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 本篇学习内容
- 简单了解一下HTTP协议
- 使用网络调试助手模拟HTTP客户端、服务器端
- 编写最简单的HTTP服务器例程


## 简单了解一下HTTP协议
![TCP/IP协议模型](/blog_images/TCP-IP协议模型.webp)

&emsp;HTTP协议是基于TCP协议的应用协议，用于提供网页访问的应用服务。本质上就是，通过TCP发送的内容符合HTTP协议写下的格式就是HTTP协议。 __这就意味着，我可以使用TCP服务器/客户端发送符合HTTP协议内容，就可以称为HTTP服务器/客户端。__ 感兴趣深入了解的，可以看《图解HTTP协议》。当然，我还是推荐先更深入了解一下TCP协议，花时间看《TCP/IP详解 卷一》。

## 使用http-server搭建HTTP服务器
&emsp;直接点击html文件，注意浏览器上的url栏是`file:`开头的，而不是`http:`开头的，这是有区别的，后者才是通过http服务器访问的页面，前者只是浏览器打开本地文件解析而已，这有时会导致异常无法打开页面（比如说使用webpack打包处理的网页就无法直接点击打开，有时也无法加载文件。）。
![file格式](/blog_images/file格式.webp)

&emsp;可以使用`http-server`来在当前路径下建立HTTP服务器（在C盘可能需要管理员的身份来运行cmd，可以选择用git bash来运行绕开。）
```bash
# 全局安装 http-server
npm install http-server -g
# 在当前路径下建立HTTP服务器
http-server .
```

## 使用网络调试助手假装成HTTP客户端
&emsp;浏览器访问网页时，浏览器就是HTTP客户端。
&emsp;我们可以使用网络调试助手假装成HTTP客户端。在浏览器输入网址`http://127.0.0.1:8080/`，其实可以等效于：（注意，HTTP协议规定了，最后一行要回车换行以代表结束）
```
GET / HTTP/1.1
Host: 127.0.0.1:8080

```

&emsp;可以看到，我们使用了TCP客户端来发送符合HTTP协议格式的内容，那么我就变成了HTTP客户端。不同的是，浏览器把拿到的内容渲染成页面，而网络调试助手拿到内容后只是直接显示出来，并没有做进一步处理。

## 使用网络调试助手假装成HTTP服务器端
![](/blog_images/网络调试助手假装成HTTP客户端.gif)
&emsp;同样的，我们可以使用网络调试助手来充当HTTP服务器端，只人符合HTTP协议的格式内容，就可以了。浏览器也能从网络调试助手那里

```
HTTP/1.1 200 OK
Content-type: text/html; charset=UTF-8
Connection:close
Keep-Alive:timeout=5

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1 style="color:red;">HTTP test response</h1>
</body>
</html>

```

## 编写最简单的HTTP服务器例程
&emsp;使用NodeJS代码编写最简单的HTTP服务器例程，这代码就不多讲太多，通过自学JS内容、Nodejs内容之后就明白了，代码如下所示：
```js
var http = require('http');
var fs = require('fs');
var HTTP_PORT = "8000";
// 创建http server，并传入回调函数:
var httpServer = http.createServer(function (request, response) {
  // 回调函数接收request和response对象,
  // 获得HTTP请求的method和url:
  console.log(request.method + ': ' + request.url);
  switch (request.url) {
    case "/":
      //访问首页
      // 读取html文件并发送
      response.end(fs.readFileSync('./index.html'));
      break;
    default:
      response.writeHead(400);
      response.end();
      break;
  }
});

httpServer.listen(HTTP_PORT);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  console.error(error)

}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('http server Listening on ' + bind);
}
```


## 附录
- [HTTP协议规范文档-rfc2616](https://tools.ietf.org/html/rfc2616)

