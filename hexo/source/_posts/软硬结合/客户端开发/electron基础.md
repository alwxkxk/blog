---
title: electron基础
toc: true
abbrlink: 1041
date: 2019-02-07 20:24:45
tags:
- electron
---


&emsp;[electron](https://electronjs.org/)使创建桌面端应用变得很简单，如果你可以建一个网站，你就可以用同样的技术建一个桌面应用程序。从开发的角度来看, Electron application 本质上是一个 Node. js 应用程序。(备注：electron网站访问需要梯子。)

## 入门例子
```bash
# 克隆这仓库
git clone https://github.com/electron/electron-quick-start
# 进入仓库
cd electron-quick-start

# 特别注意，由于国内网络问题，需要配置使用国内镜像才能正常安装（阿里巴巴镜像）
# 创建文件 .npmrc 并添加以下内容：
# PS:运行electron时会出现 Alibaba PC Safe service进程，作用不明。
registry=https://registry.npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/

# 安装依赖库
npm install
# 运行应用
npm start

# 打包构建成exe文件
npm run package
```

&emsp;我在这个`electron-quick-start`基础上，直接修改代码，实现demo2所有功能（不包含数据库），完整代码可在[项目代码](https://github.com/alwxkxk/soft-and-hard)里的`/demo2/electron-quick-start`找到。

## 构建打包
&emsp;对于很多客户来说，一个exe桌面应用才算得上真正的客户端，可以通过构建打包做出exe应用。exe文件运行效果：
<video class="lazy" controls data-src="https://test-1251805228.file.myqcloud.com/%E8%BF%90%E8%A1%8Celectron%E7%94%9F%E6%88%90%E7%9A%84exe%E6%96%87%E4%BB%B6.mp4" controls="controls" style="max-width: 100%; display: block; margin-left: auto; margin-right: auto;">
your browser does not support the video tag
</video>

&emsp;可在百度网盘下载[demo2-electron-app-win32-x64](https://pan.baidu.com/s/1b6SzjqAAXCQuxBnXq5wZyw)，在自己电脑上运行一下。
&emsp;现在官方文档的[构建步骤（Windows)](https://electronjs.org/docs/development/build-instructions-windows)是需要安装Visual Studio 2017的，心想我电脑硬盘只剩下个几十G不一定能装得下来，同时记得以前不是这样的，所以搜索了一下，可以使用
[electron-builde](https://github.com/electron-userland/electron-builder)或[electron-packager](https://github.com/electron-userland/electron-packager)，前者功能更强但我折腾了半天没成功（神秘的力量导致某些依赖包下载不成功），后者一下就搞定了。

## 实现demo2功能
&emsp;demo2是基于express框架构建出来的，一开始我想移植过去后来寻找方案时看大家的交流才发现，其实已经不再需要express框架。demo2里，客户端是浏览器，服务器端是express框架，浏览器可能是这里打开，服务器端有可能部署在云服务器，两者是分开使用的，所以两者之间是通过HTTP与websocket进行数据通信。而在electron里，两者是绝对在一起的，所以并不需要通过HTTP与websocket进行通信。
&emsp;首先是将相关文件移植过来，包括`index.html`、`mongodb.js`、`tcp-client.js`、`tcp-server.js`，以及图片、前端所引用到的JS文件。
&emsp;`index.html`修改如下：将引用CDN的JS文件以及样式都下载到本地。因为 Electron 在运行环境中引入了 Node.js，所以在 DOM 中有一些额外的变量，比如 module、exports 和require。 这导致 了许多库不能正常运行，因为它们也需要将同名的变量加入运行环境中，按[文档](https://electronjs.org/docs/faq#%E6%88%91%E5%9C%A8-electron-%E4%B8%AD%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8-jquery%E3%80%81requirejs%E3%80%81meteor%E3%80%81angularjs%E3%80%82)进行变量重命名，以保证第三方JS库正常使用。
```html
    <!-- 使Jquery正常使用 -->
    <script>
        window.nodeRequire = require;
        delete window.require;
        delete window.exports;
        delete window.module;
    </script>
    <link rel="stylesheet" href="./stylesheets/style.css">
    <script src="./javascripts/jquery.min.js"></script>
    <link href="./stylesheets/bootstrap.min.css" rel="stylesheet">
    <script src="./javascripts/bootstrap.min.js"></script>
```
&emsp;在index.js里要引用nodejs相关的模块时，就要使用`nodeRequire(...)`而不再是`require(...)`，比如：`const { ipcRenderer } = nodeRequire('electron')`

&emsp;electron是分主进程与渲染进程，`index.html`所引用的`index.js`是渲染进程，而根目录`main.js`是主进程。在主进程里，我们开启了`tcp-server`，并通过[ipc通信](https://electronjs.org/docs/api/ipc-main)使两者传输数据。ipcMain模块是[EventEmitter类](https://nodejs.org/api/events.html#events_class_eventemitter)的一个实例。 当在主进程中使用时，它处理从渲染器进程（网页）发送出来的异步和同步信息。 从渲染器进程发送的消息将被发送到该模块。官方文档例程：
```js
// 在主进程中.
const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

```

```js
//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

## FAQ 
1. 安装时总是卡在安装electron怎么办？
答：可能是墙的原因，国内淘宝官方做出了相关镜像：
在根目录新建文件`.npmrc`，填入：
```
registry=https://registry.npm.taobao.org
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
```


