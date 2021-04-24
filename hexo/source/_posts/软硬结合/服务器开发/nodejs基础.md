---
title: nodejs基础
toc: true
abbrlink: 56793
date: 2018-09-08 21:24:50
tags:
- Nodejs
---
&emsp;nodejs语法是基于JavaScript的，所以要学习nodejs需要拥有基本的JavaScript使用经验。

## 安装nodejs
1. 搜索nodejs官网
2. 下载nodejs，大家下载稳定版本（LTS: Long Term Support ）。安装一直点下一步即可。
![下载nodejs](/blog_images/005BIQVbgy1fvbmhyji22j30xk0rn0v5.jpg)
3. 在cmd里运行`node -v`与`npm -v`验证nodejs安装成功。
![验证nodejs安装成功](/blog_images/005BIQVbgy1fvbmigtxlcj31hc0t4jw0.jpg)
验证安装成功就代表了：1.程序安装成功。2.环境变量（PATH） 设置正确。

## 其它nodejs教程
&emsp;相关书籍与网上的教程有很多，__我就不重复，大家花时间去学习（大约一到两个星期左右能入门）__，后面我补充一些相关内容。

《深入浅出Node.js》- 朴灵
[菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
[廖雪峰教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)
[《七天学会NodeJS》](https://github.com/nqdeng/7-days-nodejs)
[《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)

![nodejs入门](/blog_images/005BIQVbgy1fz2vwu5kckj30sq0dlacr.jpg)

## 搭建最简TCP服务器
&emsp;先简单地了解一下[TCP/IP协议基础](/posts/19508)，至少先学会怎么使用网络调试助手。这里，我简单地写一个tcp服务器端脚本[nodejs HTTP-API中文文档](http://nodejs.cn/api/net.html)，再使用网络调试助手充当客户端连接服务器进行通信：（源码可在github上的base/tcp里找到）

<iframe src="//player.bilibili.com/player.html?bvid=BV1Dp4y1t7hm&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

```javascript
// 导入net模块:
const net = require('net')
const PORT = "9001"
//创建服务器对象
const server = net.createServer((socket)=>{
  //connect
  let addr = socket.address().address + ':' + socket.address().port
  let welcome =  addr + ' connected.\n'
  socket.write(welcome, 'ascii')

  // recieve data
  socket.on("data",data=>{
    let str = addr+" receive: " + data.toString('ascii') + '\n'
    console.log(str)
    socket.write(str, 'ascii')
  })

  // close
  socket.on('close',()=>{
    console.log(addr,"close")
  })

  socket.on('error',(err)=>{
		console.log("error",err)
  })
})

server.on("error",(err)=>{
  console.log(err)
})

//开启监听
server.listen({port: PORT,host: '0.0.0.0'}, () => {
  console.log('tcp1 server running on', server.address())
})
```

## 搭建最简HTTP服务器
&emsp;之前在[HTML、CSS、JS基础](/posts/54080)里所编写的网页，都是以本地打开文件的方式运行，并不是通过HTTP协议访问网页。[HTTP协议基础](/posts/34265)
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
&emsp;将代码使用nodejs启动起来，就是一个最简单的HTTP服务器。nodejs启动脚本的方法是node + 脚本名称：（示例`node index.js`）

<iframe src="//player.bilibili.com/player.html?bvid=BV1zf4y1s7UV&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

&emsp;[nodejs HTTP-API中文文档](http://nodejs.cn/api/http.html)。注意了，与本地直接打开网页不同，网址栏是http开头的。（本地直接打开的是file开头）。这时，你可以使用手机连接到同一个WIFI里，找到电脑的IP地址，输入网址就可以访问到网页。 


## 作业
1. 搜索并搞懂JS事件回调，nodejs的使用error first回调风格的原因。
2. 搜索并学习如何打断点调试自己的nodejs程序。
3. 学习ES6语法。
4. 学习Express框架，学习pug模板（旧版叫jade，搜索这个名字能找到比较多的教程），我时常使用[工具](https://html2jade.org/)将HTML转成jade。

## 下一节
- [linux基础](/posts/34982)