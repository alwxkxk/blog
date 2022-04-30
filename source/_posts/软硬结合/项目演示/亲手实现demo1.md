---
title: 【软硬结合】亲手实现demo1
toc: true
abbrlink: 24742
date: 2021-07-25 20:07:12
tags:
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [NodeMCU基础](/posts/31494)
- [demo1跑起来](/posts/64786/)
- [计算机网络基础](/posts/37707)
- [NodeMCU与网络调试助手联调](/posts/7602)
- [使用NodeJs实现TCP服务器](/posts/58215)
- [HTML、CSS、JS基础](/posts/54080)
- [使用NodeJs实现HTTP服务器](/posts/33173) 
- [亲手实现demo0.1](/posts/38208)
- [Bootstrap基础](/posts/27238)
- [Express框架](/posts/22339)

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=14" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>


## 本篇学习内容
- 讲解demo1里服务器端代码、界面代码、NodeMCU代码
- 阶段性作业：自行实现demo1效果
## demo1总览
&emsp;在之前的[demo1跑起来](/posts/64786/)里面已经介绍了demo1跑起来的效果了，这篇不再演示，而是直接讲解代码。（PS：图片中的IP地址根据实际情况变化，图里只是简单地举例。）
![demo1通信示意](/blog/blog_images/demo1通信示意.webp)
&emsp;整个demo1的整体代码流程图如下所示：
![demo1流程图](/blog/blog_images/demo1流程图.webp)
&emsp;首先服务器端的代码要跑起来，整个代码就是由Express手脚架（generator）一健生成的。然后NodeMCU通电跑程序时，首先连接WIFI，连接WIFI成功后会连接TCP服务器，成功后会不断地发送`tick`数值，我用这个当作心跳（在之前的课程里：[亲手实现demo0.1](/posts/38208) 里有讨论过为什么要引入心跳机制），然后一直等待接收控制指令，执行开关灯。
&emsp;服务器端跑起来后，可以访问网页界面，点击网页界面的按钮，服务器端程序接收到控制指令，进而转发到对应的硬件里，硬件接收到就执行开关灯。

## demo1界面代码
&emsp;demo1的界面极其简单，就是一个下拉框一个表格，两个按钮。界面代码在`demo1/myapp/views/index.html`，里面有引用的静态文件如`<script src="/javascripts/index.js"></script>`对应的位置就是在`demo1/myapp/public/javascripts/index.js`，这个对应着界面的逻辑代码，就是由它来获取在线设备数据，渲染到界面，点击按钮控制在线设备开关灯等业务。
&emsp;为了获取在线设备列表，界面每次向服务器端发出一个请求（轮询）,服务端会返回所有的在线设备，格式就是数组，数组晨的每个设备的数据格式对应着`{addr:'...',id:'...'}`：
```js
function getData() {
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 0	UNSENT	代理被创建，但尚未调用 open() 方法。
      // 1	OPENED	open() 方法已经被调用。
      // 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
      // 3	LOADING	下载中； responseText 属性已经包含部分数据。
      // 4	DONE	下载操作已完成。

      // 删除select里的旧数据（根据类名来找到那些元素）
      var selectItems = document.getElementsByClassName('equipment-select-item')
      for (var i = 0; i < selectItems.length; i++) {
        selectItems[i].remove()
      }
      // 删除table里的旧数据（根据类名来找到那些元素）
      var tableItems = document.getElementsByClassName('equipment-table-item')
      for (var i = 0; i < tableItems.length; i++) {
        tableItems[i].remove()
      }

      var responseData = JSON.parse(httpRequest.responseText)
      responseData.forEach(equipment=>{
        // 给select 添加新数据
        addSelectorData(equipment)
        // 给table 添加新数据
        addTableData(equipment)
      })

    }
  };
  httpRequest.open('GET', '/equipmentArray');
  httpRequest.send();
}

// 马上使用一次。
getData()

// 每一秒轮询一次
setInterval(() => {
  getData()
}, 1000);

```
&emsp;JavaScript能控制界面的变化，本质就是操作DOM对象。新增了一个在线设备，我给下拉框添加一个选择，所以我就创建对应的`option`元素挂到`select`元素之下，所以下拉框就多了这个选项：
```js
function addSelectorData(equipment) {
  // 给select 添加新数据
  var selector = document.getElementById('dev-selector');
  var option = document.createElement('option');
  // 添加这个类名是方便后面删除时定位到这些元素
  option.className = 'equipment-select-item' 
  option.innerText = equipment.addr+' - '+equipment.id
  selector.append(option)
}
```
&emsp;给按钮绑定一个事件，当点击开灯按钮时就会向服务器端：
```js
function postData(equipment,actionString){
  // 发送控制指令
  if(!equipment){
    return console.log('没设备，不可发送指令')
  }
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var params = 'action='+actionString+'&addr='+equipment.addr+'&id='+equipment.id
  httpRequest.open('POST', '/');
  httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  httpRequest.send(params);
}

// 点击按钮事件
document.getElementById('open').onclick = ()=>{
  var equipment = getEquipmentInfo()
  postData(equipment,'open')
}

```
### demo1里NodeMCU代码
&emsp;NodeMCU里的代码，就是不断尝试连接WIFI，连接成功后不断尝试连接TCP服务器，连接成功发送它的唯一ID，然后进入死循环，一直等待服务器端的控制指令，若有就执行开关灯，若无就发送`tick`值心跳（数字不断增加）。
```c
  while (client.connected()) {
    //      接收到TCP数据
    if (client.available())
    {
      String line = client.readStringUntil('\n');
      if (line == "1") {
        Serial.println("command:open led.");
        digitalWrite(LED_BUILTIN, LOW);
        client.print("OK");
      }
      else if (line == "0") {
        Serial.println("command:close led.");
        digitalWrite(LED_BUILTIN, HIGH);
        client.print("OK");
      }
    }
    else {
      //若没收到TCP数据，每隔一段时间打印并发送tick值
      Serial.print("tem:");
      Serial.println(tick);
      client.print(tick);
      tick++;
      delay(1000);
    }
  }
```

&emsp;在实际使用时，设备往往拥有一个唯一ID，这个ID用来结合业务逻辑的，比如说我把ID值为001001作为广州市里的某一块设备，ID值002001作为中山市里的一块设备，当广州市的板子坏了，需要替换时，我依旧把ID写成001001，那么它就能继续它的业务逻辑。

## demo1服务器端代码
&emsp;整个程序的入口启动文件就是`myapp/bin/www`，界面的代码是`myapp/views/index.html`。HTTP服务器就是由Express框架生成的，我们额外添加了TCP服务器的代码`myapp/bin/tcp-server.js`。
&emsp;当浏览器打开网页时，发起HTTP请求（GET /），服务器代码进入到`myapp/routes/index.js`发送界面文件：
```javascript
router.get('/', function(req, res, next) {
  // 默认是使用pug模板的，为了减少不必要的学习与降低入门门槛，改使用html。
  res.sendFile('index.html',{root:path.join(__dirname , '../views')});
});
```
&emsp;当使用硬件连接到服务器时，硬件发出的第一条数据成为其设备id，所有数据都会存放到`socket.lastValue`中。为了防止不同的读者使用同一个设备ID操作时数据串扰，所以我还额外添加了IP地址以区分。在demo0.1直接使用一个tcpClient变量存放对象，所以它只能支持一个设备，现在改进后使用一个数组存放多个设备就支持多个设备了。所有超过心跳时间没有发数据的都会删除设备。
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

```js
// myapp\bin\tcp-server.js
const equipmentArray = []
// 给列表添加设备
function addEquipment(socket) {
	// 先从列表删除旧的同名连接
	deleteEquipment(socket.id,socket.addr)
	equipmentArray.push(socket)
}
```


&emsp;浏览器发出POST请求后，由服务器端代码`myapp/routes/index.js`进行处理，找到对应的设备，并发送控制命令，此时硬件接收到命令进行开关灯。根据POST里的body数据：`req.body.addr`,`req.body.id`,`req.body.action`找到对应的设备，转发控制命令数据：
```js
// POST / 控制设备开关灯
router.post('/',function(req, res, next) {
  let addr = req.body.addr
  let id = req.body.id
  let action = req.body.action
  if(action === 'open' || action === 'close'){
    tcpServer.sentCommand(id,addr,action)
  }
  res.json(req.body);
})
```
&emsp;界面向服务器端发送的值是`open`字体符串，服务器端根据id与IP地址找到那个硬件（虽然代码上写的是数组可兼容多个设备，但理论上是唯一的，只有一个设备。），并向硬件转发时发的是`1`:
```js
// myapp\bin\tcp-server.js
// 给设备发送控制命令
function sentCommand(id,addr,command) {
	let equipments = findEquipment(id,addr)
	if(equipments.length === 0){
		return;
	}
	if(command === 'open'){
		equipments.forEach((socket)=>{
			socket.write("1", 'ascii')
		})
	}
	else if(command === 'close'){
		equipments.forEach((socket)=>{
			socket.write("0", 'ascii')
		})
	}
}
```

## 补充说明
&emsp;JS代码里时不时可以看到声明变量时使用的是`const`与`let`来取代`var`，那是ES6引入的语法，用来解决`var`本身的一些缺陷，具体可自行搜索学习。
## 阶段性作业
&emsp;光听课以为自己什么都懂，其实只有自己实践过才是真的懂，在实践的过程中才会发现自己不懂的地方。所以请读者自行实现demo1效果，有什么问题请提出来，我会全部解答。

## 奔向demo2
&emsp;demo1尽量追求简单入门，所以界面不好看（帅是第一生产力），性能也不足。先说说demo1的问题：
- HTTP轮询性能低，时效性差（每一秒轮询代表着极限情况下是有可能2秒才得到最新数据）。
- 界面丑（优化并会引入图表库Echart，实现数据可视化）
- 不能显示历史数据（引入数据库）


&emsp;为了解决以上问题，我们正式奔向demo2。


## FAQ
1. 有好几个读者提问过引用文件的路径问题，估计是相关教程没有提到，这里简单说一下：

```xml
  <link rel="stylesheet" href="/stylesheets/style.css">
  <link href="/stylesheets/bootstrap.min.css" rel="stylesheet">
  <script src="/javascripts/jquery.min.js"></script>
  <script src="/javascripts/bootstrap.min.js"></script>
```
有读者问，引用外部文件时为什么是`/xxx`这样子，而不是`./xxx`或者`../xxx`。`/`代表根路径，`./`代表当前路径,`../`代表当前路径的上一级。为了方便举例，假设我的HTTP服务器所设置的文件如下：
```bash
index.html
--javascripts
----jquery.min.js 
--pages
----user.html
```
如果我访问index.html，它想引用javascripts文件夹下的jquery.min.js，那么我浏览器打开的网址是`http://127.0.0.1`或者`http://127.0.0.1/index.html`，而index.html里就要写`<script src="/javascripts/jquery.min.js"></script>`或者`<script src="./javascripts/jquery.min.js"></script>`

如果我访问user.html，它想引用javascripts文件夹下的jquery.min.js，那么我浏览器打开的网址是`http://127.0.0.1/pages/user.html`，而user.html里就要写`<script src="/javascripts/jquery.min.js"></script>`或者`<script src="../javascripts/jquery.min.js"></script>`


在HTTP服务器中，访问`/`就是访问根路径，一般我们会在这个位置上放`index.html`，因为浏览器访问`/`默认等效为`/index.html`。要想拿到jquery.min.js这文件，要么写绝对路径`/javascripts/jquery.min.js`，要么写相对路径。对于index.html来说，它的相对路径是当前路径的文件夹下，所以是`./javascripts/jquery.min.js`，但对于user.html来说，它的相对路径是上一级路径的文件夹下，所以是`../javascripts/jquery.min.js`

而在demo1中，虽然从文件结构上看路径是相距很远，但其实我们使用express框架时使用了代码`app.use(express.static(path.join(__dirname, 'public')));`声明了这个文件是静态文件路径，它就会把这些文件夹放到`/`里。