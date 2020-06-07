---
title: demo2
toc: true
tags:
  - IOT
abbrlink: 64594
donate: true
date: 2018-11-03 10:05:02
---
&emsp;大家尽量使用chrome浏览器，其它浏览器可能会出现问题。（比如说IE内核的浏览器不支持ES6。）
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- 每次刷新页面才会显示最新的tick值。（讨论HTTP轮询以及websocket协议）
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 引入数据库，保存数据。

## 先跑起来
&emsp;demo2我已经部署到我自己的服务器，大家可在线浏览：[http://sh.scaugreen.cn/equipmentId/123456](http://sh.scaugreen.cn/equipmentId/123456)
![](/blog_images/005BIQVbgy1fz4sstfxyxj31hc0t4npd.jpg)
&emsp;这里的`123456`就是客户端ID。如果结合demo2里的nodemcu程序（程序中id设置为`1234abcd`），就需要访问[http://sh.scaugreen.cn/equipmentId/1234abcd](http://sh.scaugreen.cn/equipmentId/1234abcd)。结合硬件的演示如下：

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo2%E6%BC%94%E7%A4%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>
&emsp;在演示中可以看到，手机控制开关灯。（硬件比较慢，大约一两秒才响应动作，应该是Arduino代码问题，但这并不影响我们示范。）
&emsp;具体部署与demo1类似，进入到对应的目录，使用命令`npm install`安装依赖，`npm start`运行，不过需要安装MongoDB才能正常运行。

## demo2主要流程图

&emsp;相对于demo1，demo2添加了数据库、websocket协议、图表库Echart。demo2代码可在[项目代码](https://github.com/alwxkxk/soft-and-hard)的`/demo2/myapp`里找到。
![](/blog_images/005BIQVbgy1fzbotaayifj30lu0coab7.jpg)

### 硬件变化
&emsp;nodemcu代码相对于demo1没有太大改动，主要是改变了TCP端口以及每秒发送随机数（模拟传感器实时取得的温度值）。此代码可在[项目代码](https://github.com/alwxkxk/soft-and-hard)里的`demo2/nodemcu`找到。
```c
const int port = 9003;//demo2 tcp 使用 9003端口

// TCP发送20-29之间随机数
client.print(20+random(0,10));
```

### HTTP客户端变化
&emsp;demo1的界面是将所有连接的设备显示出来，手动刷新获取最新值，选中某个设备发送开/关灯命令。
&emsp;demo2的界面是进入网页时就已经指定了某个单一设备，只要设备不断地上传数据，界面就实时地把数据在图表中显示出来，点击按钮发送开/关灯命令。
![](/blog_images/005BIQVbgy1fz50jf130yj31co0qfqv5.jpg)
&emsp;界面为了追求一定程序的美化，所以加了很多没有实质性作用只是单纯为了更好看的内容。此代码是在express框架内，可在[项目代码](https://github.com/alwxkxk/soft-and-hard)里的`demo2/myapp/views/index.pug`找到界面代码，`demo2/myapp/public/javascripts/index.js`找到JS代码。JS代码主要做了几件事：
1. 创建websocket连接，接收该设备的实时数据。
2. 给开/关按钮添加POST请求代码。
3. 初始化Echart图表，用于显示实时数据。
4. 请求历史数据，在Echart上显示。

### 服务器端变化
&emsp;服务器端的代码在demo1上增加内容：
1. 增加MongoDB数据库操作，TCP服务器接收到的所有数据都存入到数据库中（只保留一个小时的历史数据）。
2. 增加websocket，给界面提供实时数据。
3. 增加TCP客户端模拟器（`demo2/myapp/bin/tcp-client.js`，id号为`123456`），模拟硬件不断产生数据，方便在没有硬件的情况下也能从界面看到实时数据。

### demo2程序讲解
&emsp;由demo1扩展而来的，所以demo1程序讲解里讲过的东西就不再重复了，只讲变化过的内容。
&emsp;浏览器打开网页时，由JS代码解析当前URL里的host用于创建websocket连接，解析URL里的设备ID用于向服务器订阅该设备的实时数据：
```javascript
// public\javascripts\index.js
// 获取当前host，用于提供url以建立websocket
const host = window.location.host
// 从当前网址里获取设备id ,比如 https://127.0.0.1/equipmentId/789 分析得到设备ID为789，若没有则为123456
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
&emsp;初始化Echart图表，并且发起请求获取该设备的历史数据，由服务器从数据库取得数据，处理并返回数据。
```javascript
// public\javascripts\index.js
//请求历史数据
$.get('/history/'+equipmentId,(data)=>{
  console.log("history:",data)
  data.forEach((v)=>{
    updateMyChart(v.time,v.value)
  })
})
```

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

## 学习过程
&emsp;在模仿demo2之前，需要学习：
- [数据可视化基础](/posts/18173)
- [HTTP协议基础](/posts/34265)：里面讨论了HTTP轮询的不足与websocket协议的最简例子。
- [数据库基础](/posts/41347)

&emsp;当修改了代码不知道怎么调试时，请看：
- [软件结合调试技巧](/posts/54436)

&emsp;以上是网页的制作，可接着阅读如何跨到其它平台，按需学习：
- [微信小程序基础](/posts/15341)
- [electron基础](/posts/1041)

&emsp;MQTT协议在物联网应用中十分流行，可单独学习整合（为了不让demo2跨度过大，所以就不整合到demo2里演示）：
- [MQTT协议基础](/posts/20945)

&emsp;demo2学习完后，整个教程就到了尾声，所有关键技术都已经介绍完了，各位读者已经可以自行编写整个物联网系统，剩下的无非是业务逻辑代码编写（比如帐号注册登陆、页面设计等等，不同的业务不同的设计）。__整个教程看似内容很少，实质上是需要读者阅读七八本书以及结合其它教程一起学习，其实需要读者学习的内容是极其之多，本教程只是演示最简单的实例给大家一个例子以参考，有利于进行正确有效的学习，少走弯路。__ 如果大家在阅读教程的过程中感受到某一块学习上有困难，尽管提出来，我会完善对应的内容或编写FAQ。本教程到此为止，很荣幸能够帮到大家。
![](/blog_images/005BIQVbgy1fz52yl0wqhj30f3044aa4.jpg)


## FAQ
1. 为什么一开始会提示一条保存数据失败？
__答：因为与连接数据库需要时间，当需要保存数据时但数据库还没连接成功的时候，就会出现保存数据失败。最近（19年10月30日）修改了代码，启动服务几秒后才会启动tcp-client，这个问题应该解决掉了。__

2. 为什么浏览器显示不了实时温度数据？
__答：之前可能是浏览器不兼容的问题，最近（19年10月30日）修改了demo2代码使其能兼容IE内核浏览器（不支持新语法导致报错）。如果还是有问题，请打开调试工具，把相关报错信息发给群里。（chrome是按F12 弹出调试工具）__ 

3. 请问网页上的那些图标是从哪里找的？
__答：[阿里图标库](http://iconfont.cn)。__ 

4. 为什么把demo项目部署到云服务器上，还是无法访问网页？
__答：整个流程是这样的，1.需要服务器demo项目运行 -> 2.数据需要通过服务器linux自带的防火墙 -> 3.数据需要通过运营商防火墙->网页访问成功。排查时一步步排查，针对1，运行demo后（以demo1为例，8001端口），另开一个窗口使用命令`curl 127.0.0.1:8001`，若返回HTML代码（如`<html......`），说明本地能访问demo项目的网页，1没问题。针对2，参考[linux基础](/posts/34982)，不再多说。针对3，需要去云平台一要配置安全组（可理解为一个安全规则），允许8001端口能流入流出；二要将安全组配置到云服务器（让这台云服务器使用这套安全规则，[阿里云-ECS实例加入安全组](https://help.aliyun.com/document_detail/25443.html?spm=a2c4g.11186623.6.854.1c422976218zlY)，腾讯云也是类似的，多看帮助文档，知道要做这事就好。）。__ 
