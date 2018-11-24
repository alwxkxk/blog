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
![下载nodejs](http://ww1.sinaimg.cn/large/005BIQVbgy1fvbmhyji22j30xk0rn0v5.jpg)
3. 在cmd里运行`node -v`与`npm -v`验证nodejs安装成功。
![验证nodejs安装成功](http://ww1.sinaimg.cn/large/005BIQVbgy1fvbmigtxlcj31hc0t4jw0.jpg)
验证安装成功就代表了：1.程序安装成功。2.环境变量（PATH） 设置正确。

## 其它nodejs教程
&emsp;相关书籍与网上的教程有很多，__我就不重复，大家花时间去学习（大约一到两个星期左右能入门）__，后面我补充一些相关内容。

《深入浅出Node.js》- 朴灵
[菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
[廖雪峰教程](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000)
[《七天学会NodeJS》](https://github.com/nqdeng/7-days-nodejs)
[《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)

## JavaScript回调函数
&emsp;nodejs里大量使用回调函数，这里简单讲一下。如果你已经对回调函数比较熟悉（玩过几天JavaScript都应该知道回调函数），那就可以直接跳过。
&emsp;要明白回调函数，首先要明白两件事：1.在JavaScript里，函数也是可以作为一个参数传入到另一个函数中。2.JavaScript的异步机制。
&emsp;去煮水（1分钟），等待水煮开（10分钟），装好热水（1分钟）。这里实际动作只用了共2分钟，而等待用了10分钟，这是很浪费时间的。__只有上一件事做完了，才能做下一件事，这是同步__
&emsp;去煮水（1分钟），去打游戏（10分钟），通知我水开了，装好热水（1分钟）。这样就免去了等待水开所浪费的时间，充分地提高了效率。__在空闲的等待里做其它事，而不必一直纠结于一定要做完这件事才能做下一件事，这就是异步。__
&emsp;为了让我知道水开了，这电热水壶就必须有个铃，当水开了就响铃，通知我去装好热水。__某件事完成后，再回过头来执行函数，这就是回调函数。__


```javascript

function fillWater(){
    console.log("装热水")
}

function boilWater(){
    console.log("去煮水");   
    //1秒钟后执行回调 
    setTimeout(fillWater,1000) 
}

function playGame(){
    console.log("玩游戏");
}

boilWater();
playGame();
//去煮水
//玩游戏
//装热水

```

## 搭建最简TCP服务器
&emsp;先简单地了解一下[TCP/IP协议基础](/posts/19508)，至少先学会怎么使用网络调试助手。这里，我简单地写一个tcp服务器端脚本[nodejs HTTP-API中文文档](http://nodejs.cn/api/net.html)，再使用网络调试助手充当客户端连接服务器进行通信：（源码可在github上的base/tcp里找到）

<video class="lazy" data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/%20tpc1-%E7%BD%91%E7%BB%9C%E8%B0%83%E8%AF%95%E5%8A%A9%E6%89%8B%E8%BF%9E%E6%8E%A5.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

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
<video class="lazy" data-src="https://test-1251805228.cos.ap-guangzhou.myqcloud.com/nodejs%E6%9C%80%E7%AE%80HTTP%E6%9C%8D%E5%8A%A1%E5%99%A8.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;[nodejs HTTP-API中文文档](http://nodejs.cn/api/http.html)。注意了，与本地直接打开网页不同，网址栏是http开头的。（本地直接打开的是file开头）。这时，你可以使用手机连接到同一个WIFI里，找到电脑的IP地址，输入网址就可以访问到网页。 




## 下一节
- nodejs中error first 回调函数风格
- [linux基础](/posts/34982)