---
title: NodeJs搭建简易mock-server
toc: true
tags:
  - mock-server
  - NodeJs
  - Express
abbrlink: 26589
date: 2019-11-09 10:45:04
---


&emsp;最近在工作中开发前端时，后端经常修改代码与数据表导致部分接口异常，而项目框架自带的mock.js由于是改写了`XMLHttpRequest`变成`MockXMLHttpRequest`导致很多异常（会导致很多第三方库出现问题，特别是加载文件这一块）。部分接口时常抽风，反复等待了几次感觉浪费太多时间，对我的开发进度不利，网上简单试了几个也不太好用，于是想折腾出mock-server。
&emsp;我的需求很简单，就是mock部分接口，没有设置mock的接口正常调用。
&emsp;当配置了mock的接口，就响应mock数据（图片来源于[mock-server](http://www.mock-server.com/)，这个工具符合需求，有nodejs模块，但折腾了几下也无法正常使用。）：
![](/blog_images/后端/expectation_response_action.png)
&emsp;没有配置mock的接口，就跳转至后端正常访问：
![](/blog_images/后端/expectation_forward_action.png)
&emsp;网上说用Express框架自己搭就行了，但没有相关代码，我简单折腾了几下还真折腾出来了。
```bash
# 创建项目
yarn init
# 安装express 框架 与 代理模块
yarn add express express-http-proxy

# 如果不使用yarn 而是使用npm ，则是：
# npm init
# npm install express express-http-proxy
```
&emsp; 将前端的请求都改指向本地mock-server服务器（如`const request= axios.create({baseURL: 'http://127.0.0.1:3000/proxy'`），mock-server代码如下：
```js
var express = require('express');
var proxy = require('express-http-proxy');
var app = express();

var url = 'www.host.com:port/api'; // 后端接口网址

// 处理跨域
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");// 允许任意头部信息
  res.header("Access-Control-Request-Method", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// 所有因为跨域而发起的 options请求直接响应200
app.options('*',function (req,res) {
  console.log('mock options',req.originalUrl)
  res.send({msg:'mock-server：模拟数据'})
})
// 代理部分请求
app.post('/proxy/user/login', function (req, res) {
  console.log('post /proxy/user/login')
  res.send({
    code: 200,
    data: 'token string',
    msg: 'mock-server：模拟数据'
  })
});

app.get('/proxy/user/info', function (req, res) {
  console.log('post /proxy/user/info')
  const obj = {
    code: 200,
    data: {name:'GoGo'},
    msg: 'mock-server：模拟数据'
  }
  res.send(obj);
});

// 其他代理 走proxy forward 到 后端接口
app.use('/proxy', proxy(url,{
  proxyReqOptDecorator:(proxyReqOpts, originalReq)=>{
    // 打印出 正在代理转发的请求
    console.log('proxy ',originalReq.originalUrl)
    return proxyReqOpts;
  }
}));

app.listen(3000, function () {
  console.log('mock-server listening on port 3000!');
});

```
&emsp; 运行上面的mock-server代码，就会mock 所有options请求以及 `POST /proxy/user/login`与`GET /proxy/user/info`这两个接口，其它请求都会正常请求后端接口（`www.host.com:port/api`）。
&emsp; 利用以下SQL语句，从数据库里直接拿数据生成JSON，再放到mock-server代码里mock出数据来：（使用mysql图形化客户时，点击查询，然后执行SQL命令，复制出来就能当数据。）

```SQL
SELECT CONCAT(
    '[', 
    GROUP_CONCAT(JSON_OBJECT('name', name, 'phoneNumber', phone_number)),
    ']'
) 
FROM person;
```

```json
[{
	"name": "John",
  "phoneNumber":"110"
}, {
	"name": "Jane",
	"phoneNumber": "120"
}]
```

&emsp;再配合nodemon模块实现自重启功能，一个简单又好用的mock-server就诞生了。

## 附录
- [mock-server](http://www.mock-server.com/)
- [How to convert result table to JSON array in MySQL](https://stackoverflow.com/questions/41758870/how-to-convert-result-table-to-json-array-in-mysql)


