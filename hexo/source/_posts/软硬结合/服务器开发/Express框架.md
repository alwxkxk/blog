---
title: Express框架
toc: true
abbrlink: 22339
date: 2021-08-12 19:54:20
tags:
---

&emsp;在阅读本篇文章之前，你已经阅读了：
- [计算机网络基础](/posts/37707)
- [NodeMCU与网络调试助手联调](/posts/7602)
- [使用NodeJs实现TCP服务器](/posts/58215)
- [HTML、CSS、JS基础](/posts/54080)
- [使用NodeJs实现HTTP服务器](/posts/33173) 
- [亲手实现demo0.1](/posts/38208)

## 本篇视频
<iframe src="//player.bilibili.com/player.html?aid=462062924&bvid=BV16L411n7Pi&cid=379908862&page=13" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="bilibili-video"> </iframe>

## 本篇学习内容
- 学习Express框架
- 使用postman模拟HTTP客户端进行调试

## 学习Express框架
&emsp;[Express框架-中文文档](http://expressjs.com/zh-cn/)是Node.js Web 应用程序框架，我们按着文档来一步步入门。

## 解析body里的数据。
&emsp;要想解析POST里body是有多种类型的（[四种常见的post请求中的参数形式](https://segmentfault.com/a/1190000014343759)），为了支持解析这些结构，还需要调用中间件进行解析：
```js
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

```

## 不使用模板引擎
&emsp;Express框架是默认使用模板引擎pug模板（以前叫jade模板，百度搜pug的话学习资料会少很多，搜jade就有很多。）现在更流行前后端分离，所以模板引擎在我看来是属于需要用的时候再学也不迟的东西。根据我们本教程的思想，不是必须的东西都不学，所以我们不使用模板引擎，有兴趣学习的自行搜索学习。
&emsp;在路由文件里，我们使用发送index.html文件来取代模板的渲染。

```js
var path = require ('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  // 默认是使用pug模板的，为了减少不必要的学习与降低入门门槛，改使用html。
  res.sendFile('index.html',{root:path.join(__dirname , '../views')});
});

```


## postman
&emsp;[postman](https://www.postman.com/downloads/)常用于HTTP API的调试，是Web开发必备的调试工具。特别是在浏览器里直接输url，都是GET请求。如果想要调试POST、PUT、DELETE等请求时，就必须要在JS代码来调用，显得十分麻烦。
&emsp;PS：有时postman调试正常的接口，在浏览器可能是失败的，因为浏览器比postman有更多的限制，比如说使用postman是不存在跨域请求的问题的，而在浏览器出于安全考虑，跨域请求被限制。
- [Postman教程大全-简书](https://www.jianshu.com/p/97ba64888894)

## 附录 
- [Postman教程大全-简书](https://www.jianshu.com/p/97ba64888894)
- [form-data、x-www-form-urlencoded、raw的区别](https://blog.csdn.net/liyantianmin/article/details/91492135)
- [四种常见的post请求中的参数形式](https://segmentfault.com/a/1190000014343759)