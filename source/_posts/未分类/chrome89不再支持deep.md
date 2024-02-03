---
title: chrome89不再支持嵌套使用deep
toc: true
abbrlink: 5208
date: 2021-03-09 18:35:37
tags:
---

## 发现问题
&emsp;发现使用chrome最新版（v89），有个别样式出现了问题，排查定位后发现是有些错误地嵌套使用`/deep/`，在v88下是没问题的，但在v89下就出现了问题，不再生效。我们使用VUE框架，ElementUI组件库，Dialog控件样式(SCSS)写成了：

```scss
.my-dialog{
  /deep/ .el-dialog {
    /deep/ .el-dialog__body{
      height: 600px;
    }
  }
}
```
&emsp;注意,嵌套使用`/deep/`是错误的，但在之前的版本没有发现问题便没发现。转换后就是：

```css
.my-dialog[data-v-0a1304a6] .el-dialog /deep/ .el-dialog__body {
    height: 600px;
}
```
&emsp; 嵌套使用`/deep/`只会让第一个`/deep/`生效，第二个是不作处理的，之前没意识到这个问题犯错了。

## 问题重现
&emsp;为了重现问题，特意下载了便携版chrome(v88)来对比（为了防止中毒，还额外研究了windows下沙盒，在沙盒里运行这软件），如图所示（测试代码附在最后）：


![issuehunt提交](/blog_images/未分类/chrome89更新带来的问题.webp)


&emsp;可以看到，在v88中，多出一个`/deep/`并不影响，但在v89里是不行的，搜索了一下，发现[chromestatus chromestatus](https://www.chromestatus.com/feature/6750456638341120)里有：


&emsp;The /deep/ combinator was a part of Shadow DOM v0, which has been deprecated and removed. Starting in M63, the /deep/ combinator was treated as a no-op, equivalent to a space " " combinator. As the code for all of Shadow DOM v0 was removed completely in M89, /deep/ will now throw exceptions in some JS operations, such as querySelectorAll. Simply replace it with " " to get pre-M89 behavior back.

&emsp;翻译过来的意思是，在89之前，chrome浏览器会将`/deep/` 当作空格字符串来处理，后面就完整删除`Shadow DOM v0`的内容了。

## 测试代码
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .foo1{
      width: 200px;
      height: 200px;
      background: yellowgreen;
    }

    .foo2{
      width: 100px;
      height: 100px;
      background: rgb(196, 199, 18);
    }

    /* .foo1 .foo3{
      width: 50px;
      height: 50px;
      background: rgb(205, 151, 50);
    } */

    .foo1 /deep/ .foo3{
      width: 50px;
      height: 50px;
      background: rgb(205, 151, 50);
    }
  </style>
</head>
<body>
  <div class="foo1">
    foo1
    <div class="foo2">
      foo2
      <div class="foo3">
        foo3
      </div>
    </div>
  </div>
</body>
</html>
```


## 附录
- [/deep/深度作用选择器作用及使用_努力吧灰灰兔 CSDN](https://blog.csdn.net/weixin_45842655/article/details/103547362)
- [说一说VUE中的/deep/用法 - 知乎](https://zhuanlan.zhihu.com/p/77112977)
- [自己制作Chrome便携版实现多版本共存 - xiangyuecn](https://www.cnblogs.com/xiangyuecn/p/10583788.html)
- [Win10开启沙盒功能和使用方法 - zeruns的文章 - 知乎](https://zhuanlan.zhihu.com/p/114057705)
- [html - What do /deep/ and ::shadow mean in a CSS selector? - Stack Overflow](https://stackoverflow.com/questions/25609678/what-do-deep-and-shadow-mean-in-a-css-selector)
