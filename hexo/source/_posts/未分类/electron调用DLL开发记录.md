---
title: electron调用DLL开发记录
toc: true
tags:
  - electron
  - DLL
abbrlink: 11026
date: 2020-01-22 20:58:44
---

&emsp;最近开发 TSC打印机，需要实现使用electron调用DLL给打印机发送命令。
&emsp;搜了一下，nodejs调用DLL，用的最多的是[node-ffi](https://github.com/node-ffi/node-ffi)，按别人的作法以及文档反复试了好多次，都是提示各种错误。根据错误信息各种google，各种尝试解决都不行。(最常见错误就是：`Error: Could not locate the bindings file.`)

&emsp;最后在issue里发现以及别人的问答中发现，原来node-ffi太旧了，已经不支持高版本的nodejs。发现另一个开发者做了高版本适配[node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi)（我测试node v12 ，electron v7 可行）。此次折腾，让我意识到写文章，最好还得带上开发环境版本，否则不同版本导致的异常还不太容易马上发现。

&emsp;为了排除DLL的问题，我自己还特意做了一个最简DLL来给自己测试：[dll最简例子：demo-dll](https://github.com/alwxkxk/demo-dll)（我编译了64位的DLL，在项目里的[/x64/Release/demo-dll.dll](https://github.com/alwxkxk/demo-dll/blob/master/x64/Release/demo-dll.dll)），编写了三个简单的函数用于验证，`returnNumber2`返回数字2，`returnString`返回字符串returnString，`sum`将两个整数相加。如何在Visual studio，用 C++ 编写一个DLL网上有很多文章，我就不再细说，选择X64后生成解决方案就会生成DLL。（注意选择32位还是64位，选错会导致报错:`Error: Dynamic Linking Error: Win32 error 193`）

![生成DLL](/blog_images/未分类/生成DLL.png)

&emsp;nodejs代码测试，正常打印出所期望的结果说明调用DLL成功：

```js
var ffi = require('ffi-napi');
var path = require('path')
var lib = path.resolve('demo-dll.dll')
var libm = ffi.Library(lib, {
  'returnNumber2': [ 'int',[]],
  'returnString':[ 'string',[]],
  'sum':[ 'int',['int','int']]
});
var a = libm.returnNumber2(); // 2
var b = libm.returnString();// returnString
var c = libm.sum(2,3);// 2+3 = 5
console.log(a,b,c)

```

&emsp;electron V7 里还需要设置 `nodeIntegration:true`才能在渲染进程里使用`require`。
```js
// 在主进程中
const { BrowserWindow } = require('electron')
let win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true
  }
})

```

## 附录
- [electron教程(三): 使用ffi-napi引入C++的dll - Silenzio - 博客园](https://www.cnblogs.com/silenzio/p/11606389.html)
- [dll教程1：如何编写dll,一步一步，全部可行](https://blog.csdn.net/qq_23100787/article/details/51241103)
