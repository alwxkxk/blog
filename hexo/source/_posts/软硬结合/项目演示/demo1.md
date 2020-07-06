---
title: demo1
toc: true
abbrlink: 64786
date: 2018-11-01 19:57:07
donate: true
tags:
- IOT
---
&emsp;大家尽量使用chrome浏览器，其它浏览器可能会出现问题。（比如说IE内核的浏览器不支持ES6。）
&emsp;搭建一个最简单的物联网项目：通过手机控制LED灯开关。
&emsp;从程序上来讲，nodemcu（TCP客户端）与TCP服务器通信，手机浏览器（HTTP客户端）与HTTP服务器通信，最终实现通过网页控制nodemcu的LED。
![demo1示例](/blog_images/005BIQVbgy1fwstl5y6srj30il0950tp.jpg)

&emsp;搞物联网，首先要懂网，属于最重要的基础知识：网络相关有三节教程：[计算机网络基础](/posts/37707/)、[IP协议基础](/posts/37286/)、[TCP协议基础](/posts/19508/)。当然，要搞东西并不需要完成理解100%才动手，一般开始只需要快速浏览大概留个印象即可，暂时我们只要明白几个知识点：
- IP地址：代表一个设备在网络中的地址
- 端口号：代表设备上某个正在运行的程序
- 两台设备之间的网络通信：代表着两个（IP地址+端口）在通信
- 客户-服务器模型（client-server model）

&emsp;从IP地址与端口号的角度来看，三台设备之间通信（这里IP地址与端口是随意配的以作演示），示意是这样的：
![demo1通信示意](/blog_images/005BIQVbgy1fwtxx9phabj30jk095jse.jpg)

## 先跑起来
&emsp;首先你手上先有一块nodemcu（淘宝价十几块），按[nodemcu基础](/posts/31494)先跑那几个例程，熟悉并保证硬件上没有问题。&emsp;淘宝价大约在十几块钱，如果是第一次玩硬件，自己没有USB线的话，记得还要额外买 __一条线__ ，[淘宝链接](https://detail.tmall.com/item.htm?id=600041066899&ali_trackid=2:mm_1201120170_1732850399_110448050250:1594048693_133_171839331&spm=a21wq.12726013.1000.1&scm=20140618.1.01010001.s101c6&ut_sk=1.utdid_null_1594048672862.TaoPassword-Outside.lianmeng-app)：

<img alt="淘宝nodemcu" src="/blog_images/005BIQVbgy1fyy8y8neuij30rw0dbtfj.jpg" style="cursor:pointer;" onclick="window.open('https://detail.tmall.com/item.htm?id=600041066899&ali_trackid=2:mm_1201120170_1732850399_110448050250:1594048693_133_171839331&spm=a21wq.12726013.1000.1&scm=20140618.1.01010001.s101c6&ut_sk=1.utdid_null_1594048672862.TaoPassword-Outside.lianmeng-app')">

&emsp;服务器与界面我已经写好了，并部署到我的服务器上（后面会演示怎么在你本地部署），具体代码自行查看demo1代码。demo1尽量追求简单入门，所以界面不好看，性能也不足，后面会讨论如何优化。整个demo1完成后，你就会对整个物联网的项目有个基本的认识，可以大大地讨论哪个环节需要怎么开发，跟别人吹水一点都不虚。
- 网址：http://119.29.107.47:8001/
- TCP服务器：119.29.107.47:9002

<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo1.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

&emsp;如果你才下单刚买nodemcu还没到手，可以先粗略快速地浏览一下其它教程，在没有硬件的情况下都可以先学习，特别是网络知识部分。demo1流程图：

![demo1流程图](/blog_images/005BIQVbgy1fx3yhijxgkj30fb0b7aa6.jpg)

&emsp;当然，如果你说不想买硬件，想通过直接通过软件模拟，看看效果，也是可以的。只需要用网络调试助手[（百度网盘下载）](https://pan.baidu.com/s/1XBpeUK9QcA0r90yZkIe6fg)，连接到demo1服务器端，连接成功后发送一条字符串当作设备id，也是可以模拟出来，只是没有硬件能直接控制LED灯开关那么直观而已。__大家一定要建立一种等效替换的意识，不管你手上是nodemcu还是单片机+ESP8266，还是什么其它比如4G模块、NB-IOT模块，对于服务器来说本质都是TCP客户端，没有任何区别，所以在调试时完全可以单纯地使用软件来等效替换。__ 在实际调试开发中，经常都需要把硬件与软件各自分开来调试，直到两者都调试正常验证正确之后，才会把软件硬件一起联调。

<img class="lazy" alt="网络调试助手模拟demo1" data-src="/blog_images/005BIQVbgy1fxuzdtrbasg31gy0rib2a.gif"></img>


## 在自己电脑上跑起来

&emsp;先不用急着学，让这个项目能在你手上完整地跑起来，先拥有它，能不能驾驭是另一回事。下面傻瓜式演示怎么把demo1在自己电脑上跑起来。

### 获取源码

&emsp;完整的源代码可以到[github](https://github.com/alwxkxk/soft-and-hard)里下载，并解压。
![获取全部源码](/blog_images/005BIQVbgy1fxa4jvz5xtj30ty0lvwi8.jpg)

### 安装环境

&emsp;服务器代码是用nodejs写的，所以要先安装nodejs。
1. 搜索nodejs官网
2. 下载nodejs，大家下载稳定版本（LTS: Long Term Support ）。安装一直点下一步即可。
![下载nodejs](/blog_images/005BIQVbgy1fvbmhyji22j30xk0rn0v5.jpg)
3. 在cmd里运行`node -v`与`npm -v`验证nodejs安装成功
![验证nodejs安装成功](/blog_images/005BIQVbgy1fvbmigtxlcj31hc0t4jw0.jpg)
### 安装依赖包并运行
&emsp;如果你有nodejs与git的使用经验就会知道，默认的作法是只上传源码，而依赖包自行安装以减少git文件体积。注意需要进入到对应的目录，使用命令`npm install`安装依赖，`npm start`运行，可以看视频操作：
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo1%E6%9C%AC%E5%9C%B0%E5%AE%89%E8%A3%85%E8%BF%90%E8%A1%8C.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

&emsp;整个过程因为没有相关基础知识，所以并不懂，很正常，经过后面的学习就会了解整个过程。(如果执行`npm install`安装依赖库时等待很久提示安装失败，可以尝试设置由淘宝提供的[国内镜像](https://npm.taobao.org/)，`npm config set registry https://registry.npm.taobao.org`，验证：`npm config get registry`，如果返回`https://registry.npm.taobao.org`说明设置成功，再次尝试安装`npm install`。)
&emsp;__特别注意，把代码部署到自己电脑上，只能够在局域网内访问，简单来讲就是电脑、硬件、手机等都必须是连在同一个WIFI里。当你使用手机换成流量模式而不是连接WIFI，你会发现网页无法访问。这是因为你电脑是没有公网IP（亦可称外网IP）的，只能在同一局域网里使用内网IP访问。要想让全世界的人都能访问到，让世界各地的硬件都能连接上，你必须要使用一台拥有公网IP的电脑，然后把这套代码部署上去。具体做法是租一台云服务器，安装linux系统，部署代码，设置安全组等等。__ 上面提到的demo1在线示范就是我租用了一个云服务器，并部署以供参考：
- HTTP服务器，网址：http://119.29.107.47:8001/
- TCP服务器：119.29.107.47:9002

&emsp;__注意区分 HTTP服务器与TCP服务器，HTTP服务器对应浏览器打开的网页，而TCP服务器对应的是硬件/网络调试助手建立TCP连接所用。__


&emsp;拥有公网IP的云服务器，本质就是一台能让世界连接上的电脑，跟你自己电脑本质差别仅仅是多了一个公网IP而已。在这台云服务器上，可以安装windows系统（不推荐）、linux系统，然后安装软件，部署代码等操作，以对外提供服务。相关教程涉：[linux基础](/posts/34982)、[IP协议基础](/posts/37286)。__因为linux学习需要比较长的时间，学习起来相对困难，建议大家先把项目跑起来先，linux与云服务器放到比较后的地方再学习。__。

### 瞎折腾
&emsp;虽然说读者可能到现在什么都不懂，但这里演示如何瞎折腾，让读者获得一下拥有感，演示一下修改网页内容：
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/demo1%E7%9E%8E%E6%8A%98%E8%85%BE%E6%BC%94%E7%A4%BA.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

## 怎么做
&emsp;具体的技术选型不再讨论，可阅读[软硬结合](/posts/44755/)，结论就是：
- 硬件：nodemcu，使用Arduino IDE进行开发，与服务器使用TCP通信
- 服务器：Nodejs，使用express4.x框架
- 界面：HTML+CSS+JavaScript，Jquery与Bootstrap

### 学习过程
- [计算机网络基础](/posts/37707)
&emsp;先了解基本的网络知识，半个小时吧。

- [nodemcu基础](/posts/31494)
&emsp;了解nodemcu与开发，两三个小时吧。

- [HTML、CSS、JS基础](/posts/54080)
&emsp;了解界面开发的三件套基础知识，__结合其它教程自学，大约两三个星期__，能做出基本的网页界面。

- [nodejs基础](/posts/56793)
&emsp;了解nodejs开发、ES6语法、express框架，__结合其它教程自学，大约两个星期__。

- 学习并模仿[demo0.1](/posts/38208)
&emsp;demo0.1是demo1的简化版，简化功能与不使用express框架，降低学习成本。

- [chrome开发者工具](/posts/52429)
&emsp;学习怎么调试网页，分析别人网页，__拥有分析并模仿别人的网页的能力__。

- [Jquery、Bootstrap基础](/posts/27238)
&emsp;学习Jquery、Bootstrap基础。__并尝试模仿别人网页，检验学习成果。__

- 学习并模仿[demo1](/posts/64786)
&emsp;尽可能地自行实现demo1效果，大约几天。

- [linux基础](/posts/34982)
&emsp;为了让后端程序部署到云服务器里，你还需要学习linux基础并购买云服务器。

## demo1程序讲解
&emsp;demo1代码可在[项目代码](https://github.com/alwxkxk/soft-and-hard)的`/demo1/myapp`里找到。整个代码就是由[Express 手脚架](http://www.expressjs.com.cn/starter/generator.html)使用`express --view=pug myapp`一健生成的。整个程序的入口启动文件就是`myapp/bin/www`，界面的代码是`myapp/views/index.pug`，其JS代码是`myapp/public/javascripts/index.js`。同时添加了TCP服务器的代码`myapp/bin/tcp-server.js`，用于接收TCP客户端的数据。
&emsp;当使用硬件连接到服务器时，硬件发出的第一条数据成为其设备id，所有数据都会存放到`socket.lastValue`中。为了防止不同的读者使用同一个设备ID操作时数据串扰，所以我还额外添加了IP地址以区分。所有超过10秒没有发数据的都会删除设备。（对应代码`myapp/bin/tcp-server.js`）
```javascript
  // receive data
  socket.on("data",data=>{
		let str = addr+" receive: " + data.toString('ascii')
		socket.lastValue = data.toString('ascii')
		console.log(str)

    // demo1中，我们定义了，接收的第一条数据为设备id
    if(!socket.id){
			socket.id = data.toString('ascii')
			socket.addr = addr
			addEquipment(socket)
    }
  })
```
&emsp;当浏览器打开网页时，发起HTTP请求（GET /），服务器代码进入到`myapp/routes/index.js`进行渲染，将已经连接到TCP服务器的设备数据都传入到模板`myapp/views/index.pug`中，渲染出对应的HTML页面再发送给浏览器进行显示。
```javascript
router.get('/', function(req, res, next) {
  res.render('index', { title: '软硬结合demo1',tcpServer:tcpServer });
});
```
&emsp;当浏览器选择某个设备，并发起开/关灯控制时，就会触发到界面的JS代码（对应`myapp/public/javascripts/index.js`），发出POST请求（POST /）：
```javascript
// 点击按钮事件
$("#open").click(function(){
  var equipment = getEquipmentInfo()
  $.post("/", { action:"open",addr: equipment.addr, id: equipment.id } );
});
 
$("#close").click(function(){
  var equipment = getEquipmentInfo()
  $.post("/", { action:"close",addr: equipment.addr, id: equipment.id } );
});
```
&emsp;浏览器发出POST请求后，由服务器端代码`myapp/routes/index.js`进行处理，找到对应的设备，并发送控制命令，此时硬件接收到命令进行开关灯。`req.body.addr，req.body.id，req.body.action`这些数据就是来源于上面的代码，前端点击按钮后向后端发送的数据：
```javascript
// POST / 控制设备开关灯
router.post('/',function(req, res, next) {
  // req.body.addr，req.body.id，req.body.action这些是来源于上面刚提到的前端代码
  let addr = req.body.addr
  let id = req.body.id
  let action = req.body.action
  if(action === 'open' || action === 'close'){
    tcpServer.sentCommand(id,addr,action)
  }
  res.json(req.body);
})
```

### 不使用pug模板
&emsp;pug模板以前叫做jade，可能搜索pug相关内容较少，可以搜索jade进行学习。在撑握html基础知识的前提下，学习使用pug模板不过是几个小时的事，十分简单。但毕竟是入门教程，理应引入较少的内容让新手尽快做出效果，以进入正循环，所以在demo1中还提供了不使用pug模板，直接使用html的做法。
```js
// demo1/myapp/routes/index.js
// GET /no-pug-index 不使用pug模板，直接发送html文件
router.get('/no-pug-index',function(req, res, next) {
  //root 传入文件所在的目录路径
  res.sendFile('no-pug-index.html',{root:"views"});
});
```
&emsp;大家可以访问`/no-pug-index`即可看到效果。在demo1中，pug模板的作用是将后台的数据渲染（render）成html文件。而一旦使用html文件，要么自己通过JS代码根据数据拼装成html文件再发送（本质上pug模板的作用就是简化这个拼接过程），要么发送一份不包含数据的html文件，由前端向后端再进行请求数据进而把数据写入到页面当中（有点前后端分离的味道）。这里我演示了第二种做法。
&emsp;大家看`demo1/myapp/views/no-pug-index.html`这个html文件，除了不包含数据其它内容基本与`index.pug`一致（pug语法更为简洁）。`no-pug-index.html`所引用的JS文件`demo1/myapp/public/javascripts/no-pug-index.js`，相对于`index.js`也仅仅是多了请求后台数据并写入到html文件的代码：
```js
$.get("/equipmentArray",(res)=>{
  res.forEach(equipment => {
    //将设备数据转换成html元素添加到页面中
    //添加到选项中
    $('select').append('<option>'+equipment.addr+' - '+equipment.id+'</option>')

    //添加到列表中
    $('table').append('<tbody><tr><td>0</td><td>'+equipment.addr+
    '</td><td>'+equipment.id+' </td><td style="overflow: hidden;">'+equipment.lastValue||'无'+'</td></tr></tbody>')
  });
});
```



## 下一个demo
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- 每次刷新页面才会显示最新的tick值。（讨论HTTP轮询以及引入websocket协议）
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 不能显示历史数据（引入数据库）
&emsp;在实现下一个demo之前会讨论解决以上问题，之后会做出一个能看能用的demo，同时会介绍其它技术。

## FAQ
1. 为什么我点击按钮没能控制LED灯亮灭？
__答：原因一：使用了错误的浏览器，可打开开发者调试工具查看是否有报错，IE浏览器，360浏览器内核太旧无法支持新版的JQuery而报错，大家请改用chrome浏览器。原因二：nodemcu可能是V3版本需要定义引脚，或者硬件异常，请到[nodemcu基础](/posts/31494)跑第一个例程，让LED灯一直闪烁确保硬件正常再跑demo1。__

2. 把项目部署到云服务器linux中，但把SSH一关网站就访问不了了，怎么才能一直打开?
__答：学习 nodejs部署工具 PM2，可以让程序一直跑着。另外在linux系统里关闭SSH后，系统会给这个pty所关联的session中的所有进程发送SIGHUP信号，SIGHUP的默认信号处理程序是终止进程，除非进程自己处理了 SIGHUP。可以学习并使用linux 命令 `screen` ，解决这个问题。__

3. 如何使ESP8266与手机不在同一局域网也能通信?
__答：这就需要把后端程序部署到云服务器。__

4. 将服务部署到云服务器后，硬件/网关如何上传数据？
__答：本质上是一样的，在自己电脑部署时硬件通过IP地址给电脑传输数据，这个IP地址是内网的。而部署到云服务器，就拥有外网IP地址，只要硬件/网关能访问外网（WIFI、4G等）一样能给外网传略数据。云服务器注意配置安全组与防火墙开放端口，具体知识请学习[网络知识](/posts/37707)与[Linux知识](/posts/34982)。__

5. `npm install` 安装依赖库等了很久，没成功安装，怎么办？
__答：如果执行`npm install`安装依赖库时等待很久提示安装失败，可以尝试设置由淘宝提供的[国内镜像](https://npm.taobao.org/)，`npm config set registry https://registry.npm.taobao.org`，验证：`npm config get registry`，如果返回`https://registry.npm.taobao.org`说明设置成功，再次尝试安装`npm install`。__

6. 请问这个demo1是前后端分离的吗？
__答：不是。前后端分离可以理解为 一个静态网页作为前端展示+ 一个只提供数据的后端，浏览器先加载出静态页面，然后通过HTTP请求向后端拿数据并展示。这样做的最大特点就是：前端与后端可以分别部署到两台不同的服务器上（当然也可以部署到同一台），这样有利于优化。而这个demo1，网页是先在后端拼出HTML（pug模板渲染的作用），再发送到浏览器显示，所以不能分开部署，不属于前后端分离的项目。__

7. 为什么我本地运行的demo1没有看到我的设备，但在博主的demo1示例网站上能看到我的设备？
__答：根本原因是你的设备“没有连接到你本地电脑的demo1，而是连接到我云服务器上的demo1。”，请检查硬件代码是否连接到你本地的demo1。（保证在同一网络之中，这样硬件才能连接到你本地的demo1。）__

8. 我自己创建的项目，运行`npm run start`时报错`ENOENT: no such file or directory, open '...\package.json'`
__答：实现认真看一下报错信息就容易看到哪里出问题了，这报错就是说无法打开`package.json`文件。如果有学node.js就知道，`npm run start`其实是根据`package.json`里配置的来执行对应的命令。__


