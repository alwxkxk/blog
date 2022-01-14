---
title: Websocket协议
toc: true
abbrlink: 21192
date: 2021-08-14 15:03:06
tags:
---
&emsp;在阅读本篇文章之前，你已经阅读了：
- [计算机网络基础](/posts/37707)
- [NodeMCU与网络调试助手联调](/posts/7602)
- [使用NodeJs实现TCP服务器](/posts/58215)
- [使用NodeJs实现HTTP服务器](/posts/33173) 
- [亲手实现demo1](/posts/24742)

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=16" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 本篇学习内容
- 了解Websocket协议的特点与使用场景
- 使用、调试Websocket通信

## WebSocket协议
&emsp;建立TCP通信之后，服务器端是能向客户端随时随地主动发数据。__但HTTP协议的设计就是无连接，“一问一答，不问不答”，客户端不发起请求，服务器不能主动向客户端发送数据__。在一些追求实时性的应用场景下，硬是使用HTTP轮询的办法去获取最新的数据，这就有严重的性能问题。如果轮询时间太短，机器扛不住。如果轮询太长，那么数据更新得太慢。即HTTP协议缺乏实时性，能不能像TCP socket通信一样，建立通信后不断开连接，并且能让服务器主动向客户端发送数据。基于这样的理念，就诞生了WebSocket协议，允许在上HTTP协议基础之上，达到TCP socket通信一样的效果。
&emsp;在追求实时性应用场景里，比如说聊天室，物联网应用要实时刷新数据，都会用到WebSocket协议，赋予界面实时更新数据的能力。举个例子，现在我想实时显示温度，若使用HTTP协议轮询，要更新十次数据就需要发起十次请求，“十问十答”。使用WebSocket协议只需要发起一次请求，就可以做到“一问十答”，由服务器主动推送数据给浏览器：
![](/blog_images/HTTP轮询与websocket.webp)

## 使用、调试Websocket
&emsp;[http://websocket.org/](http://websocket.org/)提供了一个websocket测试网址，会回复所接收的数据(echo:回声)，我们可以在JS里直接使用浏览器自带的API来使用websocket。我们每秒向websocket服务器端发送一个值，它就会回复相同的内容。源代码可在项目代码里的`\基础教程\WebSocket协议\WebSocket例子`找到:

<img class="lazy" alt="WebSocket" data-src="/blog_images/005BIQVbgy1fydgd0oltfg31gy0ri4qp.gif">
![](/blog_images/websocket例子.webp)

```js
// 创建websocket连接
const socket = new WebSocket('wss://echo.websocket.org/');

// 如果建立连接
socket.onopen=()=>{
  console.log("websocket connect!")
  let i=0;
  //定时发送数据
  let interval = setInterval(() => {
    //WebSocket.readyState:
    // 0 (CONNECTING):The connection is not yet open.
    // 1 (OPEN):The connection is open and ready to communicate.
    // 2 (CLOSING):The connection is in the process of closing.
    // 3 (CLOSED):The connection is closed or couldn't be opened.
    // 如果不处于连接状态，就停止定时发送数据
    if(socket.readyState !== 1){
      clearInterval(interval)
      return;
    }else{
      i++;
      socket.send('tick - '+i);
    }
  }, 1000);
}

// 监听接收数据
socket.onmessage=(message)=>{
  console.log("-->",message.data)
}

socket.onclose=()=>{
  console.log("websocket close.")
}

socket.onerror=(event)=>{
  console.log("websocket error:",event)
}
```



&emsp;服务器端可以使用[ws模块](https://github.com/websockets/ws)搭建WebSocket服务器，然后就可以使用从浏览器直接调用 WebSocket API进行连接。为方便学习，不增加太多新概念，服务器端我们使用ws模块进行演示。具体代码可查看源代码`\基础教程\WebSocket协议\Websocket服务器端例子`，运行前先阅读该目录下的`README`。
&emsp;我们依旧使用Express建立起HTTP服务器。要运行它，进入`基础教程\WebSocket协议\Websocket服务器端例子\myapp`目录，执行`npm install`安装依赖后，再运行`npm run start`。
&emsp;在它的基础上，添加了ws模块，代码放在`myapp\bin\websocket.js`里。

```js
// bin\websocket.js
const WebSocket = require('ws');
const moment = require('moment')

// 初始化websocket服务器
function init(server) {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws)=>{
    console.log("websocket connection.")
    ws.on('message', (message)=>{
      console.log('received: %s', message);
      ws.send('echo:'+message);
    });

    let interval = setInterval(()=>{
      if(ws.readyState === WebSocket.OPEN){
        
        let data = [
          {
            time:moment().format('mm:SS'),//moment生成时间 
            value:22+Math.random().toFixed(2)*10
          }
        ]
        //ws 模块只支持传送二进制或字符串，将数组转换成JSON字符串再发送出去
        let stringifyData  = JSON.stringify(data)
        ws.send(stringifyData);
      }
      else{
        clearInterval(interval)
      }
    },1000)

    ws.on('close',()=>{
      console.log('websocket close.')
    })

    ws.on('error',(err)=>{
      console.log('websocket error.',err)
    })

  });
}

module.exports = {
  init:init
}
```

&emsp;然后在`bin\www`里使用它：
```js
// bin\www
let websocket = require('./websocket.js')
websocket.init(server)
```



## 补充说明
&emsp;而在平时开发使用，一般开发者会使用[socket.io模块](https://github.com/socketio/socket.io)，这个是在WebSocket协议基础之上，增加了一系列功能如：支持命名空间、超时重连、若浏览器不支持WebSocket则自动降级使用HTTP轮询等等。使用socket.io时，并不能直接使用浏览器的WebSocket API连接，必须使用socket.io库。
&emsp;还有人做了一个[websocket在线调试工具](http://www.websocket-test.com/)，调试时也可以用这个工具来调试。