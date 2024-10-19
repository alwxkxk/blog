---
title: 【软硬结合】亲手实现demo2
toc: true
abbrlink: 29864
date: 2021-07-26 19:43:09
tags:
img: /blog_images/demo2.webp
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [demo1跑起来](/posts/64786/)
- [demo2跑起来](/posts/64594/)
- [部署到云服务器](/posts/31687/)  
- [Bootstrap基础](/posts/27238)
- [Express框架](/posts/22339)
- [亲手实现demo1](/posts/24742)


- [数据可视化基础](/posts/18173)
- [Websocket协议](/posts/21192)
- [数据库基础](/posts/41347)

## 本篇学习内容
- 讲解一下demo2
- 亲自实现demo2

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=18" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## demo2主要流程图

&emsp;相对于demo1，demo2添加了数据库、websocket协议、图表库Echart。demo2代码可在项目代码的`/demo2/myapp`里找到。
![](/blog_images/demo2.webp)

## 硬件代码变化
&emsp;nodemcu代码相对于demo1没有太大改动，主要是改变了TCP端口以及每秒发送随机数（模拟传感器实时取得的温度值，能产生20~30的数值）。此代码可在项目代码里的`demo2/nodemcu`找到。
```c
const int port = 9003;//demo2 tcp 使用 9003端口

// TCP发送20-29之间随机数
client.print(20+random(0,10));
```

## 界面代码变化
&emsp;demo1的界面是将所有在线的设备显示出来，选中某个设备发送开/关灯命令。
&emsp;demo2的界面是进入网页时通过url指定特定的单一设备（取代demo1中的下拉框选择设备），只要设备不断地上传数据，界面就实时地把数据在图表中显示出来，点击按钮发送开/关灯命令。
![](/blog_images/demo2演示图.webp)
&emsp;界面为了追求一定程序的美化，所以加了很多没有实质性作用只是单纯为了更好看的内容。此代码是在express框架内，可在项目代码里的`demo2/myapp/views/index.html`找到界面代码，`demo2/myapp/public/javascripts/index.js`找到JS代码。JS代码主要做了几件事：
1. 创建websocket连接，接收该设备的实时数据。
2. 给开/关按钮添加POST请求代码。
3. 初始化Echart图表，用于显示实时数据。
4. 请求历史数据，在Echart上显示。

&emsp;浏览器打开网页时，由JS代码解析当前URL里的host用于创建websocket连接，解析URL里的设备ID用于向服务器订阅该设备的实时数据：
```javascript
// public\javascripts\index.js
// 获取当前host，用于提供url以建立websocket
const host = window.location.host
// 从当前网址里获取设备id .
// 比如 https://127.0.0.1/equipmentId/789 分析得到设备ID为789，若没有则为123456
let equipmentId = window.location.pathname.split("/")[2] || "123456"

// 创建websocket连接
const socket = new WebSocket('ws://'+host);
// 如果建立连接
socket.onopen=()=>{
  console.log("websocket connect!")
  let data = JSON.stringify({equipmentId:equipmentId})
  socket.send(data)
}
```
&emsp;发起请求获取该设备的历史数据，由服务器从数据库取得数据，处理并返回数据。
```javascript
// public\javascripts\index.js
//请求历史数据
function getHistory() {
  //获取历史数据
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 4	DONE	下载操作已完成。
      const data = JSON.parse(httpRequest.responseText)
      console.log("history:",data)
      data.forEach((v)=>{
        updateMyChart(v.time,v.value)
      })
    }
  };

  httpRequest.open('GET', '/history/'+equipmentId);
  httpRequest.send();
}
getHistory()
```

## 服务器端变化
&emsp;服务器端的代码在demo1上增加内容：
1. 增加MongoDB数据库操作，TCP服务器接收到的所有数据都存入到数据库中（只保留一个小时的历史数据）。页面加载时会请求历史数据，直接通过图表展示出来。
2. 增加websocket，给界面提供实时数据。
3. 增加TCP客户端模拟器（`demo2/myapp/bin/tcp-client.js`，id号为`123456`），模拟硬件不断产生数据，方便在没有硬件的情况下也能从界面看到实时数据。

```javascript
// routes\index.js
// 获取某设备的历史数据
// GET /history/123456 取得设备id为12356的数据。
router.get('/history/:id', function(req, res, next) {
  mongodb.find({id:req.params.id},(err,docs)=>{
    if(err){
      res.send(err)
    }
    else{
      let result = []
      docs.forEach( (doc) => {
        result.push({
          time:moment(doc.createdAt).format('mm:ss'),
          value:doc.data
        })
      });
      result.reverse()
      res.send(result)
    }
  })
});
```

## 结束语
&emsp;大家可以亲自实现demo2。
&emsp;demo2学习完后，整个教程就到了尾声，所有关键技术都已经介绍完了，各位读者已经可以自行编写整个物联网系统，剩下的无非是业务逻辑代码编写（比如帐号注册登陆、页面设计等等，不同的业务不同的设计）。__整个教程看似内容很少，实质上是需要读者阅读七八本书以及结合其它教程一起学习，其实需要读者学习的内容是极其之多，本教程只是演示最简单的实例给大家一个例子以参考，有利于进行正确有效的学习，少走弯路。__ 如果大家在阅读教程的过程中感受到某一块学习上有困难，尽管提出来，我会完善对应的内容、编写FAQ。本教程到此为止，很荣幸能够帮到大家。
![](/blog_images/很荣幸能够帮到大家.webp)

## 其它扩展内容
- [chrome开发者工具](/posts/52429)
- [软件结合调试技巧](/posts/54436)
- [Nginx基础](/posts/19114)
- [将demo2制作成微信小程序](/posts/15341/)
- [将demo2制作成exe应用程序](/posts/1041/)
- [最后的讨论](/posts/41995/)
- [linux基础](/posts/34982)
