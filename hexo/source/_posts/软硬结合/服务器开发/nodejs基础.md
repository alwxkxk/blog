---
title: nodejs基础
toc: true
abbrlink: 56793
date: 2018-09-08 21:24:50
tags:
---
&emsp;nodejs语法是基于JavaScript的，所以要学习nodejs需要拥有基本的JavaScript使用经验。

# 安装nodejs
1. 搜索nodejs官网
2. 下载nodejs，大家下载稳定版本。（LTS: Long Term Support ）
![下载nodejs](http://ww1.sinaimg.cn/large/005BIQVbgy1fvbmhyji22j30xk0rn0v5.jpg)
3. 在cmd里运行`node -v`与`npm -v`验证nodejs安装成功
![验证nodejs安装成功](http://ww1.sinaimg.cn/large/005BIQVbgy1fvbmigtxlcj31hc0t4jw0.jpg)
验证安装成功就代表了：1.程序安装成功。2.环境变量（PATH） 设置正确。

# JavaScript回调函数
&emsp;nodejs里大量使用回调函数，这里简单讲一下。如果你已经对回调函数比较熟悉（玩过几天JavaScript都应该知道回调函数），那就可以直接跳过。
&emsp;要明白回调函数，首先要明白两件事：1.在JavaScript里，函数也是可以作为一个参数传入到另一个函数中。2.JavaScript的异步机制。
>去煮水（1分钟），等待水煮开（38分钟），装好热水（1分钟）。这里实际动作只用了共2分钟，而等待用了38分钟，这是很浪费时间的。
去煮水（1分钟），去打游戏（38分钟），通知我水开了，装好热水（1分钟）。这样就免去了等待水开所浪费的时间，充分地提高了效率。
为了让我知道水开了，这电热水壶就必须有个铃，当水开了就响铃，通知我去装好热水。
为了节省这些等待时间，就有了异步机制：某件事完成后，调用函数。


```javascript
function boilWater(){
    console.log()
}
```

# 搭建最简HTTP服务器
&emsp;之前在[HTML、CSS、JS基础](/posts/54080)里所编写的网页，都是以本地打开文件的方式运行，并不是通过HTTP协议访问网页。[HTTP协议基础]((/posts/34265)
&emsp;现在我们做一个最简单的HTTP服务器，以下代码从[廖雪峰教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345015296018cac40c198b543fead5c549865b9bd4a000)搬运过来。
```javascript
// 导入http模块:
var http = require('http');

// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});
    // 将HTTP响应的HTML内容写入response:
    response.end('<h1>Hello world!</h1>');
});

// 让服务器监听8080端口:
server.listen(8080);
console.log('Server is running at http://127.0.0.1:8080/');
```
# 后续学习
- nodejs中error first 回调函数风格
- [linux基础](/posts/34982)