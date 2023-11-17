---
title: 【软硬结合】使用NodeJs实现TCP服务器
toc: true
abbrlink: 58215
date: 2021-08-06 21:26:22
tags:
---
&emsp;在阅读本篇文章之前，你已经阅读了：
- [软硬结合-导读](/posts/44755)
- [NodeMCU基础](/posts/31494)
- [demo1跑起来](/posts/64786/)
- [demo2跑起来](/posts/64786/)
- [部署到云服务器](/posts/31687/)
- [计算机网络基础](/posts/37707)
- [NodeMCU与网络调试助手联调](/posts/7602)

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=8" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 本篇学习内容
- 编写最简单的TCP服务器例程
- 自学基本的JavaScript知识
- 建立要利用搜索引擎解决问题的意识

## 最简单的TCP服务器例程
&emsp;创建一个空文件夹，拉到vscode里，创建一个js文件，把代码写进去并跑起来：
```js
var net = require('net')
var PORT = "9002"
var tcpClient = null;// tcp客户端，只记录最新接入的那个

var server = net.createServer((socket)=>{
  //connect
  tcpClient = socket// 保存最新接入的那个，方便后面定时发送0/1
  var addr = socket.address().address + ':' + socket.address().port
  var welcome =  addr + ' connected.\n'
  socket.write(welcome, 'ascii')

  // recieve data
  socket.on("data",data=>{
    var str = addr+" --> " + data.toString('ascii') + '\n'
    console.log(str)
  })

  // close
  socket.on('close',()=>{
    tcpClient = null
    console.log(addr,"close")
  })

  socket.on('error',(err)=>{
    tcpClient = null
    console.log("error",err)
  })
  
})

server.on("error",(err)=>{
  console.log(err)
})

server.listen({port: PORT,host: '0.0.0.0'}, () => {
  console.log('tcp1 server running on', server.address())
})

var flag = true
setInterval(() => {
  if(tcpClient){
    flag = !flag // 不断取反
    tcpClient.write(flag?'1':'0') // 若true则发送1，若false发送0
  }
}, 1000);

```


## 使用网络调试助手充当客户端进行调试
&emsp;在上一节[NodeMCU与网络调试助手联调](/posts/7602)里，我们使用了网络调试助手来 __等效替换__ 服务器端程序与界面，来控制NodeMCU开关灯。这节我们反过来，使用网络调试助手来充当客户端，使用我们NodeJs写的程序来当服务器端程序。
&emsp;或许有读者会问，这里为啥还要用网络调试助手来等效替换NodeMCU，上一节课不是已经把NodeMCU打通了吗？为何不直接用来调试呢？还等效替换多此一步？
&emsp;大家可以试一下体验，直接使用NodeMCU与自己写的服务器端程序进行开发验证时，当发现行不通的时候，你怀疑的是两个地方，是NodeMCU代码有问题还是服务器端程序有问题？但是，如果我们使用的是网络调试助手的话，开发验证阶段，我的怀疑点就只有一个，那就是服务器端程序有问题。这样的调试难度是低一个层次的，只有等我把服务器端验证好了，我才会把NodeMCU接进来联调。等大家有更多的实践开发经验的时候就会有这种体验，这种等效替换属于“只有体验过才知道的好”，随着大家的实践经验积累就会发现。
&emsp;在之前使用网络调试助手时，我们是手动发送0和1来控制开关灯的，但是我们写的程序没办法手动发送，我们就定时发送，每隔一秒发送0，下一秒发送1，来临时模拟，等后面我们写了界面程序的时候再真正实现界面控制。
## 使用NodeMCU进行联调验证
&emsp;使用网络调试助手验证完之后，就可以让NodeMCU接上去联调了。依旧是使用[NodeMCU与网络调试助手联调](/posts/7602)。我们可以看到，由于服务器端定时发送0/1，所以NodeMCU是定时开关灯。
&emsp;至此，我们成功地将NodeMCU与服务器端打通了，虽然服务器端的程序是简单版的，后面还要根据实际需要不断完善，但基本已经打通这个环节了。

## 自学基本的JavaScript语法
&emsp;在之前都是复制粘贴代码的，因为我们还没开始正式学如何写JavaScript代码，现在开始正式自学，学习过程中发现是属于高级难懂的东西可以跳过（比如说闭包一时半会理解不了，先放下，没关系的，后面会随着你不断积累就会突然理解。），__我们的学习目标：把所有提到的代码都能看懂，能随着自己的想法修改代码验证，最终能亲自写出来。__ 不同人所需要的时间不一样（有些人已经有其它语言的编程经验，这东西是一通百通，对于他们来说只是熟悉一下语法罢了，而对于萌新来说，是需要接触很多新概念），别人已经写好了优秀的教程，我不再做重复工作了：

- [JavaScript教程-廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312)（PS：里面有教Jquery的，这属于旧东西了，可以不学习。）
- [JavaScript-菜鸟教程](http://www.runoob.com/js/js-tutorial.html)
- 书籍：《JavaScript高级程序设计》


- [《七天学会NodeJS》](https://github.com/nqdeng/7-days-nodejs)
- [《Node.js 包教不包会》](https://github.com/alsotang/node-lessons)
- 书籍：《深入浅出Node.js》- 朴灵

![nodejs入门](/blog_images/nodejs入门.webp)


&emsp;同时，由于JavaScript的学习过程，有会提到HTML的内容，所以一般也会一同学习，大家可以进入下一课[HTML、CSS、JS基础](/posts/54080)。
![网页制作入门 推荐书籍](/blog_images/网页制作入门推荐书籍.webp)

## 搜索引擎是最好的老师
&emsp;在学习、实践的过程中，会不断出现看不懂的名词，这时就需要用搜索引擎来搜索，它是你的24小时老师。不断使用搜索引擎来解决自己的疑惑，解决问题，这个过程会不断地提升自学能力，解决问题的能力。（百度经常搜出广告，大家可以使用必应，有条件的可以使用Google。）
